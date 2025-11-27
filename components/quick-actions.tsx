"use client";
import { Button } from "@/components/ui/button";
import { Plus, Users, BarChart3, Settings, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

interface QuickActionsProps {
  onOpenNewChecklist?: () => void;
  onOpenInviteMember?: () => void;
  onOpenNewGuideline?: () => void;
}

const quickActions = [
  {
    title: "Create Checklist",
    description: "Start a new audit checklist",
    icon: Plus,
    color: "bg-[#16A34A] hover:bg-[#15803D]",
    action: "newChecklist",
  },
  {
    title: "Invite Team Member",
    description: "Add someone to your team",
    icon: Users,
    color: "bg-blue-500 hover:bg-blue-600",
    action: "inviteMember",
  },
  {
    title: "Upload Guidelines",
    description: "Add new PDF or video guides",
    icon: Upload,
    color: "bg-purple-500 hover:bg-purple-600",
    action: "newGuideline",
  },
  {
    title: "View Reports",
    description: "Check performance analytics",
    icon: BarChart3,
    color: "bg-orange-500 hover:bg-orange-600",
    action: "reports",
  },
  {
    title: "Manage Settings",
    description: "Configure your workspace",
    icon: Settings,
    color: "bg-gray-500 hover:bg-gray-600",
    action: "settings",
  },
];

export function QuickActions({
  onOpenNewChecklist,
  onOpenInviteMember,
  onOpenNewGuideline,
}: QuickActionsProps) {
  const router = useRouter();

  const handleAction = (action: string) => {
    switch (action) {
      case "newChecklist":
        if (onOpenNewChecklist) {
          onOpenNewChecklist();
        }
        break;
      case "inviteMember":
        if (onOpenInviteMember) {
          onOpenInviteMember();
        }
        break;
      case "newGuideline":
        if (onOpenNewGuideline) {
          onOpenNewGuideline();
        }
        break;
      case "reports":
        router.push("/dashboard/analytics");
        break;
      case "settings":
        router.push("/dashboard/settings");
        break;
      default:
        console.log("Action:", action);
    }
  };

  return (
    <div className="space-y-3">
      {quickActions.map((action, index) => (
        <Button
          key={index}
          variant="outline"
          className="w-full justify-start h-auto p-4 hover:bg-gray-50 bg-transparent"
          onClick={() => handleAction(action.action)}
        >
          <div className={`p-2 rounded-lg mr-3 ${action.color}`}>
            <action.icon className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <div className="font-medium text-sm">{action.title}</div>
            <div className="text-xs text-muted-foreground">
              {action.description}
            </div>
          </div>
        </Button>
      ))}
    </div>
  );
}
