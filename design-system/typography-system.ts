// CheckIt Dashboard Typography System
// Based on Tailwind CSS + shadcn/ui defaults

export const typographySystem = {
  // Font Family
  fontFamily: {
    primary: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fallback: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },

  // Font Sizes (Tailwind CSS scale)
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
    "6xl": "3.75rem", // 60px
  },

  // Font Weights
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },

  // Line Heights
  lineHeight: {
    tight: "1.25",
    normal: "1.5",
    relaxed: "1.625",
  },

  // Usage in CheckIt Dashboard
  components: {
    // Headers
    h1: "text-3xl font-bold", // 30px, 700 weight
    h2: "text-2xl font-semibold", // 24px, 600 weight
    h3: "text-xl font-semibold", // 20px, 600 weight
    h4: "text-lg font-medium", // 18px, 500 weight

    // Body Text
    bodyLarge: "text-base", // 16px, 400 weight
    bodyMedium: "text-sm", // 14px, 400 weight
    bodySmall: "text-xs", // 12px, 400 weight

    // UI Elements
    button: "text-sm font-medium", // 14px, 500 weight
    label: "text-sm font-medium", // 14px, 500 weight
    caption: "text-xs text-muted-foreground", // 12px, muted color

    // Navigation
    navItem: "text-sm font-medium", // 14px, 500 weight
    navTitle: "text-lg font-semibold", // 18px, 600 weight

    // Cards & Data
    cardTitle: "text-lg font-semibold", // 18px, 600 weight
    cardContent: "text-sm", // 14px, 400 weight
    metric: "text-2xl font-bold", // 24px, 700 weight
    metricLabel: "text-xs text-muted-foreground", // 12px, muted
  },
}
