// Font Fallback System Explanation for CheckIt Dashboard

export const fontFallbackSystem = {
  // Your current font stack
  fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",

  // How fallbacks work (in order of priority):
  fallbackOrder: [
    {
      font: "Inter",
      type: "Web Font (Google Fonts)",
      description: "Primary font - needs to be loaded from internet",
      availability: "Requires internet connection to load",
      loadTime: "~100-300ms",
    },
    {
      font: "system-ui",
      type: "System Default",
      description: "Uses the operating system's default UI font",
      availability: "Always available",
      examples: {
        macOS: "SF Pro Display",
        Windows: "Segoe UI",
        Linux: "Ubuntu, Cantarell, or system default",
      },
    },
    {
      font: "-apple-system",
      type: "Apple System Font",
      description: "Apple's system font (San Francisco)",
      availability: "macOS, iOS devices",
      examples: {
        macOS: "SF Pro Display",
        iOS: "SF Pro Text",
      },
    },
    {
      font: "BlinkMacSystemFont",
      type: "Webkit System Font",
      description: "Webkit browsers on macOS",
      availability: "Safari, Chrome on macOS",
      result: "San Francisco font family",
    },
    {
      font: "Segoe UI",
      type: "Windows System Font",
      description: "Microsoft's system font",
      availability: "Windows Vista and later",
      characteristics: "Clean, readable, designed for UI",
    },
    {
      font: "Roboto",
      type: "Android System Font",
      description: "Google's system font for Android",
      availability: "Android devices, some Linux distributions",
      characteristics: "Modern, geometric, highly legible",
    },
    {
      font: "sans-serif",
      type: "Generic Fallback",
      description: "Browser's default sans-serif font",
      availability: "Always available (last resort)",
      examples: {
        common: "Arial, Helvetica, or browser default",
      },
    },
  ],
}

// Why fallbacks are important:
export const fallbackImportance = {
  reasons: [
    "Internet connectivity issues - Inter might not load",
    "Font loading failures - CDN problems",
    "Performance optimization - System fonts load instantly",
    "Accessibility - Ensures text is always readable",
    "Cross-platform consistency - Different devices have different fonts",
  ],

  withoutFallbacks: {
    problem: "If Inter fails to load and no fallbacks exist",
    result: "Browser uses its default font (usually Times New Roman)",
    impact: "Breaks your design completely",
  },

  withFallbacks: {
    benefit: "Graceful degradation",
    result: "Similar-looking system font is used",
    impact: "Design remains consistent and professional",
  },
}
