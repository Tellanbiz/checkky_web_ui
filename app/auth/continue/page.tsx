"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  Users,
  Plus,
  ArrowRight,
  CheckCircle,
  Sparkles,
} from "lucide-react";

export default function ContinuePage() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<
    "create" | "join" | null
  >(null);

  const handleCreateCompany = () => {
    setSelectedOption("create");
    router.push("/companies/new");
  };

  const handleJoinCompany = () => {
    setSelectedOption("join");
    router.push("/invites");
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Sparkles className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Checkky!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            You're almost ready to start managing your audits and checklists.
            Choose how you'd like to get started with your company.
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Create New Company */}
          <Card
            className={`relative overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-xl border-2 ${
              selectedOption === "create"
                ? "border-green-500 shadow-green-100"
                : "border-gray-200 hover:border-green-300"
            }`}
            onClick={handleCreateCompany}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Create New Company
                </CardTitle>
              </div>
              <p className="text-gray-600">
                Start fresh with your own company and set up everything from
                scratch.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">
                    Full administrative control
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">
                    Customize company settings
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">
                    Invite team members
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">
                    Set up audit workflows
                  </span>
                </div>
              </div>

              <Button
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-white"
                onClick={handleCreateCompany}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Company
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Join Existing Company */}
          <Card
            className={`relative overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-xl border-2 ${
              selectedOption === "join"
                ? "border-green-500 shadow-green-100"
                : "border-gray-200 hover:border-green-300"
            }`}
            onClick={handleJoinCompany}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Join Company
                </CardTitle>
              </div>
              <p className="text-gray-600">
                Join an existing company using an invitation link or code.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">
                    Quick team integration
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">
                    Access existing workflows
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">
                    Collaborate with team
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">
                    Start contributing immediately
                  </span>
                </div>
              </div>

              <Button
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-white"
                onClick={handleJoinCompany}
              >
                <Users className="h-4 w-4 mr-2" />
                Join Company
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <div className="text-center">
          <div className="bg-gray-50 rounded-2xl p-6 shadow-sm border border-gray-200 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Need Help?
            </h3>
            <p className="text-gray-600 mb-4">
              If you're not sure which option to choose or need assistance, our
              support team is here to help you get started.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <span>📧 support@checkit.com</span>
              <span>💬 Live Chat</span>
              <span>📖 Documentation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
