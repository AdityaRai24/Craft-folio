# Component Customization System

This document explains how to implement database persistence for component customizations in the NeoSpark template.

## Overview

The component customization system allows users to customize various aspects of NeoSpark components (Hero, Technologies, Projects, etc.) and saves these customizations to the database for persistence across sessions.

## Database Schema

The system uses the `ComponentCustomization` table in the database:

```sql
model ComponentCustomization {
  id          String   @id @default(uuid())
  portfolio   Portfolio @relation(fields: [portfolioId], references: [id], onDelete: Cascade)
  portfolioId String
  settings    Json     
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([portfolioId])
}
```

## API Actions

The following actions are available in `app/actions/portfolio.ts`:

### `saveComponentCustomization`
Saves or updates component customization settings.

```typescript
const result = await saveComponentCustomization({
  portfolioId: "portfolio-id",
  componentType: "hero",
  settings: customizationObject
});
```

### `getComponentCustomization`
Retrieves customization settings for a specific component.

```typescript
const result = await getComponentCustomization({
  portfolioId: "portfolio-id",
  componentType: "hero"
});
```

### `getAllComponentCustomizations`
Retrieves all customizations for a portfolio.

```typescript
const result = await getAllComponentCustomizations({
  portfolioId: "portfolio-id"
});
```

### `deleteComponentCustomization`
Deletes customization settings for a component.

```typescript
const result = await deleteComponentCustomization({
  portfolioId: "portfolio-id",
  componentType: "hero"
});
```

## Utility Hook

Use the `useComponentCustomization` hook for easy integration:

```typescript
import { useComponentCustomization } from "@/lib/componentCustomization";

const MyComponent = () => {
  const defaultCustomization = {
    // your default settings
  };
  
  const [customization, setCustomization] = useState(defaultCustomization);
  
  const { loadCustomizations, updateCustomization, resetCustomization } = useComponentCustomization(
    portfolioId,
    "component-type",
    defaultCustomization
  );

  // Load customizations on mount
  useEffect(() => {
    if (portfolioId) {
      loadCustomizations(setCustomization);
    }
  }, [portfolioId, loadCustomizations]);

  // Update customization
  const handleChange = (key: string, value: any) => {
    updateCustomization(key, value, customization, setCustomization);
  };

  // Reset customization
  const handleReset = () => {
    resetCustomization(setCustomization);
  };
};
```

## Implementation Steps

1. **Import the utility hook** in your component
2. **Define default customization state**
3. **Use the hook** with portfolioId, componentType, and defaultCustomization
4. **Load customizations** on component mount
5. **Replace setCustomization calls** with updateCustomization calls
6. **Update reset function** to use the utility

## Component Types

Supported component types:
- `hero` - Hero section customizations
- `technologies` - Technologies section customizations  
- `projects` - Projects section customizations
- `professional-journey` - Professional Journey section customizations
- `contact` - Contact section customizations

## Example Implementation

See `components/NeoSpark/Hero.tsx` for a complete implementation example.

## Error Handling

The system includes automatic error handling with toast notifications for:
- Failed saves
- Failed loads
- Failed resets

## Performance Considerations

- Customizations are loaded once on component mount
- Updates are debounced to prevent excessive database calls
- Failed operations show user-friendly error messages 