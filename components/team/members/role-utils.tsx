import { Shield, Eye, UserCheck, Users } from "lucide-react";

export const getRoleIcon = (role: string) => {
  switch (role) {
    case "admin":
      return <Shield className="h-4 w-4 text-red-600" />;
    case "auditor":
      return <UserCheck className="h-4 w-4 text-blue-600" />;
    case "assignee":
      return <Users className="h-4 w-4 text-green-600" />;
    case "viewer":
      return <Eye className="h-4 w-4 text-gray-600" />;
    default:
      return <Users className="h-4 w-4 text-gray-600" />;
  }
};

export const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "admin":
      return "bg-red-100 text-red-800";
    case "auditor":
      return "bg-blue-100 text-blue-800";
    case "assignee":
      return "bg-green-100 text-green-800";
    case "viewer":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getRoleDisplayName = (role: string) => {
  switch (role) {
    case "admin":
      return "Admin";
    case "auditor":
      return "Auditor";
    case "assignee":
      return "Assignee";
    case "viewer":
      return "Viewer";
    default:
      return role;
  }
};
