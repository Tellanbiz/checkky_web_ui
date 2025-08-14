import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const activities = [
  {
    user: "Sarah Johnson",
    action: "completed",
    item: "Livestock Health Check",
    time: "2 minutes ago",
    avatar: "SJ",
    type: "completion",
  },
  {
    user: "Mike Wilson",
    action: "created",
    item: "Equipment Maintenance Checklist",
    time: "15 minutes ago",
    avatar: "MW",
    type: "creation",
  },
  {
    user: "Emma Davis",
    action: "commented on",
    item: "Crop Quality Assessment",
    time: "1 hour ago",
    avatar: "ED",
    type: "comment",
  },
  {
    user: "John Smith",
    action: "assigned",
    item: "Flower Farm Inspection to Lisa Brown",
    time: "2 hours ago",
    avatar: "JS",
    type: "assignment",
  },
  {
    user: "Lisa Brown",
    action: "uploaded evidence for",
    item: "Safety Protocol Check",
    time: "3 hours ago",
    avatar: "LB",
    type: "upload",
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-start space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">{activity.avatar}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm">
              <span className="font-medium">{activity.user}</span>{" "}
              <span className="text-muted-foreground">{activity.action}</span>{" "}
              <span className="font-medium">{activity.item}</span>
            </p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
          <Badge
            variant="outline"
            className={`text-xs ${
              activity.type === "completion"
                ? "border-green-200 text-green-700"
                : activity.type === "creation"
                  ? "border-blue-200 text-blue-700"
                  : activity.type === "comment"
                    ? "border-purple-200 text-purple-700"
                    : activity.type === "assignment"
                      ? "border-orange-200 text-orange-700"
                      : "border-gray-200 text-gray-700"
            }`}
          >
            {activity.type}
          </Badge>
        </div>
      ))}
    </div>
  )
}
