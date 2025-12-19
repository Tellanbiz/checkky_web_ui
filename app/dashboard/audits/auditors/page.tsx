"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Users, Mail, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuditors } from "@/lib/services/auditors/get";
import { GetAuditorsRow } from "@/lib/services/auditors/data";
import { useToast } from "@/hooks/use-toast";

export default function AuditorsPage() {
  const [auditors, setAuditors] = useState<GetAuditorsRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadAuditors = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAuditors();
      setAuditors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load auditors");
      toast({
        title: "Error",
        description: "Failed to load auditors. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAuditors();
  }, []);

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "super-admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "admin":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "auditor":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-8">
        <div className="flex items-center justify-end">
          <Button variant="outline" onClick={loadAuditors} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadAuditors} disabled={isLoading}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Auditors</h1>
          <p className="text-muted-foreground">
            Manage and view all auditors in your organization
          </p>
        </div>
        <Button variant="outline" onClick={loadAuditors} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Auditors
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditors.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Auditors List */}
      <Card>
        <CardHeader>
          <CardTitle>Auditors</CardTitle>
          <CardDescription>
            All team members with auditor permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {auditors.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No auditors found</p>
              <p className="text-sm text-gray-400 mt-1">
                Team members with auditor roles will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {auditors.map((auditor) => (
                <div
                  key={auditor.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={auditor.user.picture}
                        alt={auditor.user.full_name}
                      />
                      <AvatarFallback className="bg-gray-200 text-gray-700 text-sm font-medium">
                        {getInitials(auditor.user.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">
                        {auditor.user.full_name}
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Mail className="w-3 h-3" />
                        <span>{auditor.user.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${getRoleColor(auditor.role)}`}
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      {auditor.role}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
