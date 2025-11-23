import dynamic from "next/dynamic";
import { ComponentType } from "react";

// Define proper types for our template configuration
export interface TemplateConfig {
  navbar?: ComponentType;
  spotlight?: boolean;
  sections: {
    [key: string]: ComponentType;
  };
  hero?: string[];
}

// Define the shape of the entire config object
export interface TemplatesConfig {
  [key: string]: TemplateConfig;
}

export const templatesConfig: TemplatesConfig = {
  NeoSpark: {
    navbar: dynamic(() => import("@/components/NeoSpark/Navbar")),
    spotlight: true,
    sections: {
      hero: dynamic(() => import("@/components/NeoSpark/Hero")),
      projects: dynamic(() => import("@/components/NeoSpark/Projects")),
      experience: dynamic(
        () => import("@/components/NeoSpark/ProfessionalJourney")
      ),
      technologies: dynamic(() => import("@/components/NeoSpark/Technologies")),
      userInfo: dynamic(() => import("@/components/NeoSpark/Contact")),
    },
    hero: [
      "name",
      "summary",
      "titlePrefix",
      "titleSuffixOptions",
      "badge",
      "actions",
    ],
  },
  MonoEdge: {
    navbar: dynamic(() => import("@/components/SimpleWhite/Navbar")),
    sections: {
      hero: dynamic(() => import("@/components/SimpleWhite/Hero")),
      projects: dynamic(() => import("@/components/SimpleWhite/Projects")),
      skills: dynamic(() => import("@/components/SimpleWhite/Skills")),
      experience: dynamic(() => import("@/components/SimpleWhite/Experience")),
      technologies: dynamic(() => import("@/components/SimpleWhite/Skills")),
      userInfo: dynamic(() => import("@/components/SimpleWhite/Contact")),
    },
    hero: ["name", "title", "summary","shortSummary"],
  },
  LumenFlow: {
    sections: {
      hero: dynamic(() => import("@/components/LumenFlow/Hero")),
    },
    hero: ["name", "title","longSummary"],
  },
  MacOS: {
    sections: {
      desktop: dynamic(() => import("@/components/MacOS/Desktop")),
    },
    hero: [],
  }
};
