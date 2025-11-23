"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Building2, Save, X } from "lucide-react";
import { useState } from "react";

interface EditCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: {
    id: string;
    name: string;
    created_at: string;
  };
}

export function EditCompanyModal({
  isOpen,
  onClose,
  company,
}: EditCompanyModalProps) {
  const [formData, setFormData] = useState({
    name: company.name,
  });

  const handleSave = () => {
    console.log("Saving company details:", formData);
    onClose();
  };

  const handleLogoUpload = () => {
    console.log("Uploading company logo");
    // Here you would handle logo upload
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>Edit Company Details</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Company Logo and Basic Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-[#16A34A] text-white font-semibold text-lg">
                    {company.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{company.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Member since{" "}
                    {new Date(company.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name *</Label>
                <Input
                  id="company-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
