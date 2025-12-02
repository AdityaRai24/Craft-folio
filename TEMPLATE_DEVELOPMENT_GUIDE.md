# Template Development Guide

This document outlines the architecture of templates in Craft-Folio and provides a step-by-step guide for adding new templates.

## Architecture Overview

Craft-Folio supports two main template architectures:

### 1. Section-Based Architecture (Recommended for Landing Pages)
Used by **NeoSpark** and **SimpleWhite**.
- **Structure**: The main page iterates through a list of sections (Hero, Projects, Experience, etc.) and renders them sequentially.
- **Navigation**: Uses a global `Navbar` component defined in the config.
- **Scrolling**: Standard vertical scrolling.
- **Best for**: Traditional single-page portfolio layouts.

### 2. Wrapper-Based Architecture (Recommended for App-Like Interfaces)
Used by **LumenFlow** and **MacOS**.
- **Structure**: The main page renders a single "Entry" component (e.g., `Hero` or `Desktop`). This component manages its own layout, routing, and sub-components.
- **Navigation**: Handled internally by the wrapper component (e.g., Tabs, Window Manager).
- **Scrolling**: Can be custom (e.g., internal scroll areas, no scroll).
- **Best for**: Unique layouts like OS simulations or tabbed interfaces.

## Directory Structure

- `components/[TemplateName]/`: Contains all components specific to the template.
- `types/[templateName]/`: Contains TypeScript definitions and default styles.
- `lib/templateConfig.ts`: The central registry mapping template names to their configuration.

## How to Add a New Template

### Step 1: Choose Architecture
Decide if your template is a standard scrolling page (Section-Based) or a complex app-like interface (Wrapper-Based).

### Step 2: Create Component Directory
Create a new folder `components/[NewTemplateName]`.

**For Section-Based:**
Create individual files for each section:
- `Navbar.tsx`
- `Hero.tsx`
- `Projects.tsx`
- ...

**For Wrapper-Based:**
Create a main entry file (e.g., `Main.tsx` or `Hero.tsx`) and sub-components.

### Step 3: Define Types and Defaults
Create `types/[newTemplateName]/` and define:
- Customization interfaces.
- Default styles/values.

### Step 4: Register the Template
Open `lib/templateConfig.ts` and add your template to the `templateConfig` object.

**Example (Section-Based):**
```typescript
NewTemplate: {
  navbar: NewTemplateNavbar,
  spotlight: false, // Enable background spotlight effect
  sections: {
    hero: NewTemplateHero,
    projects: NewTemplateProjects,
    // ...
  },
  features: {
    badge: true,
    actions: true,
    // ... enable/disable global features
  },
  // ...
}
```

**Example (Wrapper-Based):**
```typescript
NewAppTemplate: {
  navbar: null, // Navbar handled internally
  sections: {
    hero: NewAppMainComponent, // The single entry point
  },
  features: {
    // ...
  },
  // ...
}
```

## Best Practices

1.  **Modularity**: Keep components small. Use `components/Shared` for generic UI elements.
2.  **Customization**: Use the `useCustomization` hook to handle user edits.
3.  **Visual Editor**: Implement a corresponding Visual Editor component for each section to allow user configuration.
4.  **Types**: Avoid `any`. Define proper interfaces in the `types` directory.
