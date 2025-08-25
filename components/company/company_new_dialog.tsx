"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, Plus } from "lucide-react";
import {
  createCompanyAction,
  updateCurrentCompanyAction,
} from "@/lib/services/company/actions";
import type { CompanyParams } from "@/lib/services/company/models";
import { useToast } from "@/hooks/use-toast";

interface CompanyNewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CompanyNewDialog({
  isOpen,
  onClose,
  onSuccess,
}: CompanyNewDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CompanyParams>({
    name: "",
    email: "",
    phone_number: "",
    address: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in the required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const ok = await createCompanyAction(formData);
      if (!ok) {
        throw new Error("Create company failed");
      }

      // Set the newly created company as the current company
      // Note: We need the company ID from the API response for this to work properly
      // For now, we'll just show the success message
      toast({
        title: "Success",
        description: "Company created successfully!",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone_number: "",
        address: "",
      });

      // Close dialog and trigger success callback
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to create company:", error);
      toast({
        title: "Error",
        description: "Failed to create company. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CompanyParams, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Add New Company</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Building2 className="w-6 h-6 text-green-600" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Company Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter company name"
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="company@example.com"
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700"
              >
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone_number}
                onChange={(e) =>
                  handleInputChange("phone_number", e.target.value)
                }
                placeholder="+1 (555) 123-4567"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="address"
                className="text-sm font-medium text-gray-700"
              >
                Address
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="123 Business St, City, State"
                className="w-full"
              />
            </div>

            <div className="pt-4 flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !formData.name || !formData.email}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Create Company</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
