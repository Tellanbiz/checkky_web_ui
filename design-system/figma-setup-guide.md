# Checkky Dashboard - Figma Setup Guide

## 🎨 Getting Lucide Icons in Figma

### Step 1: Install Lucide Icons Plugin
1. Open Figma
2. Go to **Plugins** → **Browse all plugins**
3. Search for **"Lucide Icons"**
4. Install the official plugin by Lucide

### Step 2: Alternative - Community File
1. Go to **Figma Community**
2. Search for **"Lucide Icons"**
3. Duplicate the official Lucide icon library
4. Access 1000+ icons instantly

### Step 3: Icon Naming Convention
All icons in your code use kebab-case names:
- `CheckSquare` → `check-square`
- `LayoutDashboard` → `layout-dashboard`
- `MessageSquare` → `message-square`
- `BarChart3` → `bar-chart-3`

## 📋 Icon Checklist for Checkky Dashboard

### Navigation Icons (Sidebar)
- [ ] layout-dashboard (Dashboard)
- [ ] check-square (Checklists + Logo)
- [ ] users (Team)
- [ ] message-square (Team Chat)
- [ ] bar-chart-3 (Analytics)
- [ ] building-2 (Companies)
- [ ] file-text (Guidelines)
- [ ] shield (Admin Tools)
- [ ] settings (Settings)
- [ ] help-circle (Help & Support)

### Action Icons
- [ ] plus (Add/Create)
- [ ] search (Search)
- [ ] filter (Filter)
- [ ] more-horizontal (Menu)
- [ ] edit (Edit)
- [ ] trash-2 (Delete)
- [ ] download (Export)
- [ ] upload (Upload)
- [ ] save (Save)
- [ ] x (Close)

### Status Icons
- [ ] check-circle (Success)
- [ ] alert-triangle (Warning)
- [ ] alert-circle (Error)
- [ ] clock (Pending)
- [ ] eye (View)
- [ ] lock (Secure)
- [ ] bell (Notifications)

### User Role Icons
- [ ] shield (Admin)
- [ ] user-check (Auditor)
- [ ] users (Assignee)
- [ ] eye (Viewer)

### Communication Icons
- [ ] mail (Email)
- [ ] message-square (Chat)
- [ ] send (Send)
- [ ] at-sign (Mention)

## 🎯 Icon Sizes in Figma

Match these sizes to your Tailwind classes:
- **12px** → `h-3 w-3`
- **16px** → `h-4 w-4` (Most common)
- **20px** → `h-5 w-5`
- **24px** → `h-6 w-6`
- **32px** → `h-8 w-8`

## 🔧 Figma Setup Tips

### Create Icon Components
1. Create a **"Icons"** page in Figma
2. Import all needed icons
3. Convert each to a **Component**
4. Organize by category (Navigation, Actions, Status)
5. Use **Variants** for different sizes

### Icon Styling
- **Stroke Width**: 2px (Lucide default)
- **Color**: Use your design tokens
- **Size**: 16px for most UI elements
- **Alignment**: Center-aligned in containers

### Component Structure
\`\`\`
🎨 Icons
├── 📁 Navigation
│   ├── layout-dashboard
│   ├── check-square
│   └── users
├── 📁 Actions  
│   ├── plus
│   ├── search
│   └── filter
└── 📁 Status
    ├── check-circle
    ├── alert-triangle
    └── clock
\`\`\`

## 🚀 Quick Start Commands

### In Figma Plugin:
1. Run **Lucide Icons** plugin
2. Search by name (e.g., "check-square")
3. Insert icon
4. Resize to 16px
5. Convert to component

### Batch Import:
1. Use the icon reference list above
2. Search and insert all navigation icons first
3. Create components for each
4. Organize into folders
5. Set up variants for different sizes
