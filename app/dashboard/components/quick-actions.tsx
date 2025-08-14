"use client"
import { Button } from "@/components/ui/button"
import { Plus, Users, BarChart3, Settings, Upload } from "lucide-react"

const quickActions = [
  {
    title: "Create Checklist",
    description: "Start a new audit checklist",
    icon: Plus,
    color: "bg-[#16A34A] hover:bg-[#15803D]",
  },
  {
    title: "Invite Team Member",
    description: "Add someone to your team",
    icon: Users,
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    title: "Upload Guidelines",
    description: "Add new PDF or video guides",
    icon: Upload,
    color: "bg-purple-500 hover:bg-purple-600",
  },
  {
    title: "View Reports",
    description: "Check performance analytics",
    icon: BarChart3,
    color: "bg-orange-500 hover:bg-orange-600",
  },
  {
    title: "Manage Settings",
    description: "Configure your workspace",
    icon: Settings,
    color: "bg-gray-500 hover:bg-gray-600",
  },
]

export function QuickActions() {
  const handleAction = (actionTitle: string) => {
    switch (actionTitle) {
      case "Create Checklist":
        // This would open the new checklist modal
        window.dispatchEvent(new CustomEvent("openNewChecklistModal"))
        break
      case "Invite Team Member":
        // This would open the invite member modal
        window.dispatchEvent(new CustomEvent("openInviteMemberModal"))
        break
      case "Upload Guidelines":
        // This would open the new guideline modal
        window.dispatchEvent(new CustomEvent("openNewGuidelineModal"))
        break
      case "View Reports":
        // This would navigate to analytics page
        window.location.href = "/analytics"
        break
      case "Manage Settings":
        // This would navigate to settings page
        window.location.href = "/settings"
        break
      default:
        console.log("Action:", actionTitle)
    }
  }

  return (
    <div className="space-y-3">
      {quickActions.map((action, index) => (
        <Button
          key={index}
          variant="outline"
          className="w-full justify-start h-auto p-4 hover:bg-gray-50 bg-transparent"
          onClick={() => handleAction(action.title)}
        >
          <div className={`p-2 rounded-lg mr-3 ${action.color}`}>
            <action.icon className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <div className="font-medium text-sm">{action.title}</div>
            <div className="text-xs text-muted-foreground">{action.description}</div>
          </div>
        </Button>
      ))}
    </div>
  )
}
