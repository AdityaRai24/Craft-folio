import NeoSparkNavbar from "@/components/NeoSpark/Navbar";
import NeoSparkHero from "@/components/NeoSpark/Hero";
import NeoSparkProjects from "@/components/NeoSpark/Projects";
import NeoSparkExperience from "@/components/NeoSpark/ProfessionalJourney";
import NeoSparkTechnologies from "@/components/NeoSpark/Technologies";
import NeoSparkContact from "@/components/NeoSpark/Contact";

import SimpleWhiteNavbar from "@/components/SimpleWhite/Navbar";
import SimpleWhiteHero from "@/components/SimpleWhite/Hero";
import SimpleWhiteProjects from "@/components/SimpleWhite/Projects";
import SimpleWhiteExperience from "@/components/SimpleWhite/Experience";
import SimpleWhiteSkills from "@/components/SimpleWhite/Skills";
import SimpleWhiteContact from "@/components/SimpleWhite/Contact";

import LumenFlowNavbar from "@/components/LumenFlow/Navbar";
import LumenFlowHero from "@/components/LumenFlow/Hero";
import LumenFlowProjects from "@/components/LumenFlow/Projects";
import LumenFlowExperience from "@/components/LumenFlow/Experience";
import LumenFlowEducation from "@/components/LumenFlow/Education";
import LumenFlowTechnologies from "@/components/LumenFlow/Technologies";

import MacOSDesktop from "@/components/MacOS/Desktop";

export const templateConfig: any = {
  NeoSpark: {
    navbar: NeoSparkNavbar,
    spotlight: true,
    sections: {
      hero: NeoSparkHero,
      projects: NeoSparkProjects,
      experience: NeoSparkExperience,
      technologies: NeoSparkTechnologies,
      contact: NeoSparkContact,
    },
    features: {
      badge: true,
      actions: true,
      titlePrefixSuffix: true,
      summary: true,
      title: false,
      shortSummary: false,
      longSummary: false,
      safari: false,
    },
    hero: ["name", "titlePrefix", "titleSuffixOptions", "summary", "badge", "actions"],
    structure: {
      technologies: "flat",
    },
    defaults: {
      hero: {
        badge: {
          color: "green",
          texts: ["Open to work", "Available for freelance", "Let's Collaborate!"],
          isVisible: true,
        },
        actions: [
          {
            url: "#projects",
            type: "button",
            label: "View Projects",
            style: "primary",
          },
          {
            url: "#contact",
            type: "button",
            label: "Contact Me",
            style: "outline",
          },
        ],
      },
    },
  },
  SimpleWhite: {
    navbar: SimpleWhiteNavbar,
    spotlight: false,
    sections: {
      hero: SimpleWhiteHero,
      projects: SimpleWhiteProjects,
      experience: SimpleWhiteExperience,
      technologies: SimpleWhiteSkills,
      contact: SimpleWhiteContact,
    },
    features: {
      badge: false,
      actions: false,
      titlePrefixSuffix: true,
      summary: true,
      title: true,
      shortSummary: true,
      longSummary: false,
      safari: false,
    },
    hero: ["name", "titlePrefix", "titleSuffixOptions", "summary", "title", "shortSummary"],
    structure: {
      technologies: "flat",
    },
    defaults: {},
  },
  MonoEdge: {
    navbar: SimpleWhiteNavbar,
    spotlight: false,
    sections: {
      hero: SimpleWhiteHero,
      projects: SimpleWhiteProjects,
      experience: SimpleWhiteExperience,
      technologies: SimpleWhiteSkills,
      contact: SimpleWhiteContact,
    },
    features: {
      badge: false,
      actions: false,
      titlePrefixSuffix: true,
      summary: true,
      title: true,
      shortSummary: true,
      longSummary: false,
      safari: false,
    },
    hero: ["name", "titlePrefix", "titleSuffixOptions", "summary", "title", "shortSummary"],
    structure: {
      technologies: "flat",
    },
    defaults: {},
  },
  LumenFlow: {
    navbar: null,
    spotlight: false,
    sections: {
      hero: LumenFlowHero,
    },
    features: {
      badge: false,
      actions: false,
      titlePrefixSuffix: false,
      summary: true,
      title: true,
      shortSummary: false,
      longSummary: true,
      safari: false,
      profileImage: true,
    },
    hero: ["name", "title", "summary", "longSummary"],
    structure: {
      technologies: "flat",
    },
    defaults: {
      userInfo: {
        profileImage: "https://placehold.co/400x400?text=Profile+Image",
      },
    },
  },
  MacOS: {
    navbar: null,
    spotlight: false,
    sections: {
      desktop: MacOSDesktop,
    },
    features: {
      badge: false,
      actions: false,
      titlePrefixSuffix: false,
      summary: false,
      title: false,
      shortSummary: true,
      longSummary: true, // Used for Safari content generation
      safari: true,
      wallpaper: true,
    },
    hero: ["name", "shortSummary", "longSummary"],
    structure: {
      technologies: "categorized",
    },
    defaults: {
      hero: {
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=3870",
      },
      userInfo: {
        profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400",
      },
    },
  },
};
