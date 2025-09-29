"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { maps } from "@/lib/templateThemeMaps";

export async function createPortfolio(
  userId: string,
  templateName: string,
  creationMethod: string,
  customBodyResume: string
) {
  try {
    const template = await prisma.template.findFirst({
      where: {
        name: templateName,
      },
      select: { defaultContent: true },
    });

    if (!template || !template.defaultContent) {
      return { success: false, error: "Template not found" };
    }

    let content: any;

    if (creationMethod === "import" && customBodyResume) {
      const templateContent: any =
        typeof template.defaultContent === "string"
          ? JSON.parse(template.defaultContent)
          : template.defaultContent;

      const customContent: any = JSON.parse(customBodyResume);
      const customSectionMap: any = {};
      if (customContent.sections && Array.isArray(customContent.sections)) {
        customContent.sections.forEach((section: any) => {
          if (section.type) {
            customSectionMap[section.type] = section;
          }
        });
      }

      const newContent = {
        ...templateContent,
        sections: templateContent.sections.map((section: any) => {
          const customSection = customSectionMap[section.type];
          if (customSection) {
            // Create a deep copy of the template data
            const mergedData = JSON.parse(JSON.stringify(section.data));

            // Merge custom data while preserving arrays
            Object.keys(customSection.data).forEach((key) => {
              const customValue = customSection.data[key];
              const templateValue = section.data[key];

              if (Array.isArray(customValue)) {
                // If custom value is an array, use it directly
                mergedData[key] = customValue;
              } else if (
                Array.isArray(templateValue) &&
                typeof customValue === "object" &&
                customValue !== null
              ) {
                // If template has an array and custom has an object, merge array items
                mergedData[key] = templateValue.map(
                  (item: any, index: number) => ({
                    ...item,
                    ...(customValue[index] || {}),
                  })
                );
              } else if (
                typeof customValue === "object" &&
                customValue !== null
              ) {
                // For objects, merge them
                mergedData[key] = {
                  ...templateValue,
                  ...customValue,
                };
              } else {
                // For primitives, use custom value
                mergedData[key] = customValue;
              }
            });

            return {
              ...section,
              data: mergedData,
              sectionTitle: section.sectionTitle,
              sectionDescription: section.sectionDescription,
            };
          }
          return section;
        }),
      };

      content = newContent;
    } else {
      content = template.defaultContent;
    }

    console.log(content);
    const newTemplate = await prisma.portfolio.create({
      data: {
        isTemplate: false,
        userId: userId,
        content: content,
        isPublished: false,
        templateName: templateName,
        fontName: maps[templateName]?.fontName,
        themeName: maps[templateName]?.themeName,
      },
    });

    revalidatePath("/portfolio");
    return { success: true, data: newTemplate };
  } catch (error) {
    console.error("Failed to create portfolio:", error);
    return { success: false, error: "Failed to create portfolio" };
  }
}

export async function updateSection({
  sectionName,
  portfolioId,
  sectionContent,
  sectionTitle,
  sectionDescription,
}: {
  sectionName: string;
  portfolioId: string;
  sectionContent: any;
  sectionTitle: string;
  sectionDescription: string;
}) {
  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { id: portfolioId },
    });
    if (!portfolio || !portfolio.content) {
      return { success: false, error: "Portfolio not found" };
    }
    const allSections = (portfolio.content as { sections: any }).sections;
    const portfolioSection = allSections.find(
      (section: any) => section.type === sectionName
    );
    if (!portfolioSection) {
      return { success: false, error: `${sectionName} section not found}` };
    }
    const updatedContent = {
      sections: allSections.map((section: any) => {
        if (section.type === sectionName) {
          return {
            type: sectionName,
            data: sectionContent,
            sectionTitle: sectionTitle,
            sectionDescription: sectionDescription,
          };
        }
        return section;
      }),
    };

    await prisma.portfolio.update({
      where: { id: portfolioId },
      data: { content: updatedContent },
    });

    return { success: true, data: updatedContent };
  } catch (error) {
    console.error("Failed to update hero:", error);
    return { success: false, error: "Failed to update hero" };
  }
}

export async function updatePortfolio({
  portfolioId,
  newPortfolioData,
}: {
  portfolioId: string;
  newPortfolioData: string;
}) {
  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { id: portfolioId },
    });
    if (!portfolio || !portfolio.content) {
      return { success: false, error: "Portfolio not found" };
    }
    const updatedData = {
      sections: newPortfolioData,
    };

    await prisma.portfolio.update({
      where: { id: portfolioId },
      data: { content: updatedData },
    });
    return { success: true, data: updatedData };
  } catch (error) {
    return { success: false, error: "Failed to update hero" };
  }
}

export async function fetchThemesApi() {
  console.log("🚀 [API] fetchThemesApi called");
  console.log("📍 [API] Environment:", process.env.NODE_ENV);
  console.log("🔑 [API] Environment variables check:");
  try {
    const themes = await prisma.template.findMany({
      orderBy: {
        name: "asc",
      },
    });

    // Reorder themes to match desired order - NeoSpark first (best template), then LumenFlow, then MonoEdge
    const orderedThemes = themes.sort((a, b) => {
      const order: Record<string, number> = {
        NeoSpark: 1,
        LumenFlow: 2,
        MonoEdge: 3,
      };
      return (order[a.name] || 999) - (order[b.name] || 999);
    });

    console.log(orderedThemes);
    return { success: true, data: orderedThemes };
  } catch (error) {
    console.error("Error fetching themes:", error);
    return { success: false, error: error };
  }
}

export async function getThemeNameApi({
  portfolioId,
}: {
  portfolioId: string;
}) {
  try {
    const theme = await prisma.portfolio.findUnique({
      where: { id: portfolioId },
      include: {
        PortfolioLink: true,
      },
    });
    return { success: true, data: theme };
  } catch (error) {
    console.error("Error fetching themes:", error);
    return { success: false, error: error };
  }
}

export async function fetchContent({ portfolioId }: { portfolioId: string }) {
  try {
    const hero = await prisma.portfolio.findUnique({
      where: { id: portfolioId },
      include: {
        PortfolioLink: true,
      },
    });
    if (!hero || !hero.content) {
      return { success: false, error: "Portfolio not found" };
    }
    return { success: true, data: hero.content };
  } catch (error) {
    console.error("Error fetching content:", error);
    return { success: false, error: error };
  }
}

export async function updateTheme({
  themeName,
  portfolioId,
}: {
  themeName: string;
  portfolioId: string;
}) {
  try {
    const theme = await prisma.portfolio.update({
      where: { id: portfolioId },
      data: { themeName: themeName },
    });
    return { success: true, data: theme };
  } catch (error) {
    console.error("Error updating theme:", error);
    return { success: false, error: error };
  }
}

export async function updateFont({
  fontName,
  portfolioId,
}: {
  fontName: string;
  portfolioId: string;
}) {
  try {
    const theme = await prisma.portfolio.update({
      where: { id: portfolioId },
      data: { fontName: fontName },
    });
    console.log({ fontName, theme });
    return { success: true, data: theme };
  } catch (error) {
    console.error("Error updating theme:", error);
    return { success: false, error: error };
  }
}

export async function updateCustomCSS({
  customCSS,
  portfolioId,
}: {
  customCSS: string;
  portfolioId: string;
}) {
  try {
    const theme = await prisma.portfolio.update({
      where: { id: portfolioId },
      data: { customCSS: customCSS },
    });
    return { success: true, data: theme };
  } catch (error) {
    console.error("Error updating theme:", error);
    return { success: false, error: error };
  }
}

export async function fetchPortfoliosByUserId(userId: string) {
  try {
    const portfolios = await prisma.portfolio.findMany({
      where: { userId },
      include: {
        PortfolioLink: true,
      },
      orderBy: { createdAt: "desc" }, // Optional: order by creation date
    });
    return { success: true, data: portfolios };
  } catch (error) {
    console.error("Error fetching portfolios by userId:", error);
    return { success: false, error: "Failed to fetch portfolios" };
  }
}

export async function deployPortfolio(
  userId: string,
  portfolioId: string,
  value: string,
  isSubdomain: boolean = false,
  isCustomDomain: boolean = false
) {
  try {
    // Different validation rules for custom domains
    if (!isCustomDomain) {
      if (value.length < 3 || value.length > 30) {
        return {
          success: false,
          error: `${
            isSubdomain ? "Subdomain" : "Portfolio Slug"
          } must be between 3 and 30 characters`,
        };
      }
      if (!/^[a-z0-9-]+$/.test(value)) {
        return {
          success: false,
          error: `${
            isSubdomain ? "Subdomain" : "Portfolio Slug"
          } can only contain lowercase letters, numbers, and hyphens`,
        };
      }
      if (value.startsWith("-") || value.endsWith("-")) {
        return {
          success: false,
          error: `${
            isSubdomain ? "Subdomain" : "Portfolio Slug"
          } cannot start or end with a hyphen`,
        };
      }
    } else {
      // Custom domain validation
      if (!value.includes(".")) {
        return {
          success: false,
          error: "Please enter a valid domain name (e.g., example.com)",
        };
      }
      if (value.length < 4 || value.length > 255) {
        return {
          success: false,
          error: "Domain name must be between 4 and 255 characters",
        };
      }
      // Basic domain format validation
      if (!/^[a-zA-Z0-9][a-zA-Z0-9-_.]*[a-zA-Z0-9]$/.test(value)) {
        return {
          success: false,
          error: "Please enter a valid domain name",
        };
      }
    }

    // Check if the value is already taken
    const existingPortfolio = await prisma.portfolioLink.findFirst({
      where: {
        OR: [{ slug: value }, { subdomain: value }, { custom_domain: value }],
      },
    });

    if (existingPortfolio) {
      return {
        success: false,
        error: `This ${
          isCustomDomain
            ? "domain"
            : isSubdomain
            ? "subdomain"
            : "portfolio slug"
        } is already taken`,
      };
    }

    // Create or update the portfolio link
    const updatedPortfolio = await prisma.portfolioLink.upsert({
      where: {
        portfolioId: portfolioId,
      },
      update: {
        ...(isCustomDomain
          ? { custom_domain: value }
          : { [isSubdomain ? "subdomain" : "slug"]: value }),
      },
      create: {
        ...(isCustomDomain
          ? { custom_domain: value }
          : { [isSubdomain ? "subdomain" : "slug"]: value }),
        portfolioId: portfolioId,
        userId: userId,
      },
    });

    // Generate the appropriate URL based on the type
    const finalUrl = isCustomDomain
      ? `https://${value}`
      : isSubdomain
      ? `https://${value}.craftfolio.live`
      : `https://craftfolio.live/p/${value}`;

    return {
      success: true,
      data: {
        ...updatedPortfolio,
        url: finalUrl,
      },
    };
  } catch (error) {
    console.error("Error deploying portfolio:", error);
    return { success: false, error: "Failed to deploy portfolio" };
  }
}

export async function getIdThroughSlug({ slug }: { slug: string }) {
  try {
    const existingPortfolio = await prisma.portfolioLink.findFirst({
      where: {
        slug: slug,
      },
    });

    if (!existingPortfolio) {
      return { success: false, error: "This Portfolio does not exists !!" };
    }

    return { success: true, portfolioId: existingPortfolio.portfolioId };
  } catch (error) {
    return { success: false, error: "Failed to fetch portfolio id slug" };
  }
}

export const updatePortfolioUserId = async ({
  portfolioId,
  newUserId,
}: {
  portfolioId: string;
  newUserId: string;
}) => {
  try {
    const updatedPortfolio = await prisma.portfolio.update({
      where: {
        id: portfolioId,
      },
      data: {
        userId: newUserId,
      },
    });

    return {
      success: true,
      data: updatedPortfolio,
    };
  } catch (error) {
    console.error("Error updating portfolio userId:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update portfolio userId",
    };
  }
};

export async function getIdThroughSubdomain({
  subdomain,
}: {
  subdomain: string;
}) {
  try {
    const portfolio = await prisma.portfolio.findFirst({
      where: {
        PortfolioLink: {
          subdomain: subdomain,
        },
      },
      select: {
        id: true,
      },
    });

    if (!portfolio) {
      return { success: false, error: "Portfolio not found" };
    }

    return { success: true, portfolioId: portfolio.id };
  } catch (error) {
    console.error("Error getting portfolio ID through subdomain:", error);
    return { success: false, error: "Failed to get portfolio ID" };
  }
}

export async function checkUserSubdomain(userId: string) {
  try {
    // Check if user is premium
    const premiumUser = await prisma.premiumUser.findFirst({
      where: {
        userId: userId,
      },
    });

    // Get current subdomain counts---
    const subdomainCount = await prisma.portfolioLink.count({
      where: {
        userId: userId,
        subdomain: {
          not: null,
        },
      },
    });

    const count = subdomainCount || 0;
    const isPremium = !!premiumUser;

    // If user is premium, allow up to 10 subdomains
    if (isPremium) {
      return {
        success: true,
        hasSubdomain: count >= 10,
        isPremium: true,
        currentCount: count,
      };
    }

    // For non-premium users, check if they have any subdomain
    const existingSubdomain = await prisma.portfolioLink.findFirst({
      where: {
        userId: userId,
        subdomain: {
          not: null,
        },
      },
    });

    return {
      success: true,
      hasSubdomain: !!existingSubdomain,
      isPremium: false,
      currentCount: count,
    };
  } catch (error) {
    console.error("Error checking user subdomain:", error);
    return {
      success: false,
      error: "Failed to check subdomain status",
    };
  }
}

export async function saveComponentCustomization({
  portfolioId,
  componentType,
  settings,
}: {
  portfolioId: string;
  componentType: string;
  settings: any;
}) {
  try {
    // Check if customization already exists
    const existingCustomization = await prisma.componentCustomization.findFirst({
      where: {
        portfolioId,
        component: componentType,
      },
    });

    if (existingCustomization) {
      // Update existing customization
      const updatedCustomization = await prisma.componentCustomization.update({
        where: { id: existingCustomization.id },
        data: {
          settings: settings,
        },
      });
      return { success: true, data: updatedCustomization };
    } else {
      // Create new customization
      const newCustomization = await prisma.componentCustomization.create({
        data: {
          portfolioId,
          component: componentType,
          settings: settings,
        },
      });
      return { success: true, data: newCustomization };
    }
  } catch (error) {
    console.error("Error saving component customization:", error);
    return { success: false, error: "Failed to save customization" };
  }
}

export async function getComponentCustomization({
  portfolioId,
  componentType,
}: {
  portfolioId: string;
  componentType: string;
}) {
  try {
    const customization = await prisma.componentCustomization.findFirst({
      where: {
        portfolioId,
        component: componentType,
      },
    });

    if (customization) {
      return { success: true, data: customization.settings };
    } else {
      return { success: false, data: null };
    }
  } catch (error) {
    console.error("Error fetching component customization:", error);
    return { success: false, error: "Failed to fetch customization" };
  }
}

export async function getAllComponentCustomizations({
  portfolioId,
}: {
  portfolioId: string;
}) {
  try {
    const customizations = await prisma.componentCustomization.findMany({
      where: { portfolioId },
    });

    const customizationsMap = customizations.reduce((acc, customization) => {
      acc[customization.component] = customization.settings;
      return acc;
    }, {} as Record<string, any>);

    return { success: true, data: customizationsMap };
  } catch (error) {
    console.error("Error fetching all component customizations:", error);
    return { success: false, error: "Failed to fetch customizations" };
  }
}

export async function deleteComponentCustomization({
  portfolioId,
  componentType,
}: {
  portfolioId: string;
  componentType: string;
}) {
  try {
    const customization = await prisma.componentCustomization.findFirst({
      where: {
        portfolioId,
        component: componentType,
      },
    });

    if (customization) {
      await prisma.componentCustomization.delete({
        where: { id: customization.id },
      });
      return { success: true };
    } else {
      return { success: false, error: "Customization not found" };
    }
  } catch (error) {
    console.error("Error deleting component customization:", error);
    return { success: false, error: "Failed to delete customization" };
  }
}
