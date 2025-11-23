"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { User, Mail, Camera, Save } from "lucide-react";
import { updateProfile } from "@/lib/services/accounts/services-post";
import { getAccount } from "@/lib/services/accounts/services-get";
import { UpdateProfileParams, Account } from "@/lib/services/accounts/models";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState<Account | null>(null);
  const [formData, setFormData] = useState<UpdateProfileParams>({
    full_name: "",
    email: "",
    picture: "",
  });

  useEffect(() => {
    // Load current user data
    const loadUserData = async () => {
      try {
        const userData = await getAccount();
        setAccount(userData);
        setFormData({
          full_name: userData.full_name,
          email: userData.email,
          picture: userData.picture || "",
        });
      } catch (error) {
        console.error("Failed to load user data:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      }
    };

    loadUserData();
  }, []);

  const handleInputChange = (
    field: keyof UpdateProfileParams,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile(formData);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For now, just create a preview URL
      // In a real app, you'd upload this to a service like AWS S3
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        handleInputChange("picture", result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b px-12 py-6 flex justify-between items-center bg-white">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Update Profile Info
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your personal information and profile settings
          </p>
        </div>
        <Button
          type="submit"
          form="profile-form"
          disabled={loading}
          className="px-6 py-2"
        >
          {loading ? (
            <>
              <Save className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="px-16 py-8">
        <form
          id="profile-form"
          onSubmit={handleSubmit}
          className="space-y-8 max-w-6xl mx-auto"
        >
          {/* Basic Information Section */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={(e) =>
                    handleInputChange("full_name", e.target.value)
                  }
                  placeholder="Enter your full name"
                  required
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Cancel Button */}
          <div className="flex justify-start">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
