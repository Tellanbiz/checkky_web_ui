"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Building2, Plus } from "lucide-react";
import type { CompanyParams } from "@/lib/services/company/models";

interface CompanySetupDialogProps {
  onCreateCompany: (companyData: CompanyParams) => Promise<void>;
}

export function CompanySetupDialog({
  onCreateCompany,
}: CompanySetupDialogProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CompanyParams>({
    name: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      return;
    }

    setLoading(true);
    try {
      await onCreateCompany(formData);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to create company:", error);
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[380px]">
        <DialogHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <DialogTitle className="text-lg">Welcome to Checkky!</DialogTitle>
          </div>
          <DialogDescription className="text-sm">
            Let's get started by setting up your first company.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Company Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter company name"
              required
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="submit"
              disabled={loading || !formData.name}
              className="w-full h-9"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Company...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Plus className="w-3 h-3" />
                  <span>Create Company</span>
                </div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
