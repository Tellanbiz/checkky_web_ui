// Checkky Dashboard - Icon Reference for Figma
// All icons used in the application from Lucide React

export const CHECKIT_ICONS = {
  // Navigation Icons
  navigation: {
    LayoutDashboard: "layout-dashboard", // Dashboard
    CheckSquare: "check-square", // Checklists & Logo
    Users: "users", // Team
    MessageSquare: "message-square", // Team Chat
    BarChart3: "bar-chart-3", // Analytics
    Building2: "building-2", // Companies
    FileText: "file-text", // Guidelines
    Shield: "shield", // Admin Tools
    Settings: "settings", // Settings
    HelpCircle: "help-circle", // Help & Support
  },

  // Action Icons
  actions: {
    Plus: "plus", // Add/Create actions
    Search: "search", // Search functionality
    Filter: "filter", // Filter options
    MoreHorizontal: "more-horizontal", // Menu actions
    Edit: "edit", // Edit actions
    Trash2: "trash-2", // Delete actions
    Download: "download", // Download/Export
    Upload: "upload", // Upload functionality
    Save: "save", // Save actions
    X: "x", // Close/Cancel
    Check: "check", // Confirm/Success
  },

  // Status & Indicator Icons
  status: {
    AlertTriangle: "alert-triangle", // Warning
    AlertCircle: "alert-circle", // Error/Alert
    CheckCircle: "check-circle", // Success
    Clock: "clock", // Pending/Time
    Eye: "eye", // View/Visibility
    EyeOff: "eye-off", // Hidden
    Lock: "lock", // Locked/Secure
    Unlock: "unlock", // Unlocked
    Star: "star", // Favorite/Rating
    Bell: "bell", // Notifications
  },

  // User & Team Icons
  users: {
    User: "user", // Single user
    Users: "users", // Multiple users
    UserPlus: "user-plus", // Add user
    UserMinus: "user-minus", // Remove user
    UserCheck: "user-check", // Verified user
    UserX: "user-x", // Blocked user
    Crown: "crown", // Admin/Owner
    Shield: "shield", // Admin role
    Eye: "eye", // Viewer role
  },

  // Communication Icons
  communication: {
    Mail: "mail", // Email
    MessageSquare: "message-square", // Chat/Messages
    Phone: "phone", // Phone contact
    Send: "send", // Send message
    Reply: "reply", // Reply
    Forward: "forward", // Forward
    AtSign: "at-sign", // Mention
  },

  // Data & Analytics Icons
  data: {
    BarChart3: "bar-chart-3", // Bar chart
    LineChart: "line-chart", // Line chart
    PieChart: "pie-chart", // Pie chart
    TrendingUp: "trending-up", // Growth
    TrendingDown: "trending-down", // Decline
    Activity: "activity", // Activity/Performance
    Target: "target", // Goals/Targets
    Calendar: "calendar", // Date/Schedule
  },

  // File & Document Icons
  files: {
    FileText: "file-text", // Documents
    File: "file", // Generic file
    Folder: "folder", // Folder
    FolderOpen: "folder-open", // Open folder
    Image: "image", // Image files
    Paperclip: "paperclip", // Attachments
    Archive: "archive", // Archive
    Database: "database", // Database
  },

  // System & Technical Icons
  system: {
    Settings: "settings", // Settings/Configuration
    Cog: "cog", // System settings
    Server: "server", // Server/System
    Database: "database", // Database
    Code: "code", // Code/Development
    Terminal: "terminal", // Command line
    Wifi: "wifi", // Connection
    WifiOff: "wifi-off", // No connection
  },

  // Navigation & Movement Icons
  movement: {
    ArrowLeft: "arrow-left", // Back
    ArrowRight: "arrow-right", // Forward
    ArrowUp: "arrow-up", // Up
    ArrowDown: "arrow-down", // Down
    ChevronLeft: "chevron-left", // Previous
    ChevronRight: "chevron-right", // Next
    ChevronUp: "chevron-up", // Expand up
    ChevronDown: "chevron-down", // Expand down
    ChevronsLeft: "chevrons-left", // First
    ChevronsRight: "chevrons-right", // Last
  },

  // Business & Company Icons
  business: {
    Building2: "building-2", // Company/Building
    Briefcase: "briefcase", // Business
    DollarSign: "dollar-sign", // Money/Billing
    CreditCard: "credit-card", // Payment
    Receipt: "receipt", // Invoice
    TrendingUp: "trending-up", // Growth
    Handshake: "handshake", // Partnership
    Award: "award", // Achievement
  },

  // Utility Icons
  utility: {
    Copy: "copy", // Copy
    ExternalLink: "external-link", // External link
    Link: "link", // Link
    Unlink: "unlink", // Unlink
    Refresh: "refresh", // Refresh
    RotateCcw: "rotate-ccw", // Undo
    RotateCw: "rotate-cw", // Redo
    Maximize: "maximize", // Fullscreen
    Minimize: "minimize", // Minimize
  },
}

// Icon sizes used in the application
export const ICON_SIZES = {
  xs: "12px", // h-3 w-3
  sm: "16px", // h-4 w-4
  md: "20px", // h-5 w-5
  lg: "24px", // h-6 w-6
  xl: "32px", // h-8 w-8
  "2xl": "40px", // h-10 w-10
}

// Icon usage by component
export const ICON_USAGE = {
  sidebar: [
    "LayoutDashboard",
    "CheckSquare",
    "Users",
    "MessageSquare",
    "BarChart3",
    "Building2",
    "FileText",
    "Shield",
    "Settings",
    "HelpCircle",
  ],
  buttons: ["Plus", "Search", "Filter", "Edit", "Trash2", "Save", "X"],
  status: ["CheckCircle", "AlertTriangle", "Clock", "Eye"],
  actions: ["MoreHorizontal", "Download", "Upload", "Send"],
  navigation: ["ChevronLeft", "ChevronRight", "ChevronUp", "ChevronDown"],
}
