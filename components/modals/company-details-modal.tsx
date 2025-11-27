"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  Users,
  CheckSquare,
  Calendar,
  Globe,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Crown,
  Star,
} from "lucide-react";

interface CompanyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: {
    id: string;
    name: string;
    created_at: string;
  };
}

export function CompanyDetailsModal({
  isOpen,
  onClose,
  company,
}: CompanyDetailsModalProps) {
  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "Enterprise":
        return (
          <Badge className="bg-purple-100 text-purple-800">
            <Crown className="w-3 h-3 mr-1" />
            {plan}
          </Badge>
        );
      case "Professional":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Star className="w-3 h-3 mr-1" />
            {plan}
          </Badge>
        );
      default:
        return <Badge variant="outline">{plan}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Company Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Company Header */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-[#16A34A] text-white font-semibold text-lg">
                {company.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{company.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  Standard
                </Badge>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800 text-xs"
                >
                  Active
                </Badge>
              </div>
            </div>
          </div>

          {/* Company Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card>
              <CardContent className="p-3 text-center">
                <Users className="h-6 w-6 mx-auto text-blue-600 mb-1" />
                <div className="text-lg font-bold">0</div>
                <p className="text-xs text-muted-foreground">Team Members</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <CheckSquare className="h-6 w-6 mx-auto text-green-600 mb-1" />
                <div className="text-lg font-bold">0</div>
                <p className="text-xs text-muted-foreground">Checklists</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold text-green-600">0%</div>
                <p className="text-xs text-muted-foreground">Completion Rate</p>
                <Progress value={0} className="mt-1" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <Calendar className="h-6 w-6 mx-auto text-purple-600 mb-1" />
                <div className="text-xs text-muted-foreground">
                  {new Date(company.created_at).toLocaleDateString()}
                </div>
                <p className="text-xs text-muted-foreground">Member Since</p>
              </CardContent>
            </Card>
          </div>

          {/* Company Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-3">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{company.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Joined {new Date(company.created_at).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
