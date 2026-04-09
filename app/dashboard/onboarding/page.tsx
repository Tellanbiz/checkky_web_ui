"use client";

import { ArrowRight, Building2, ClipboardList, MonitorSmartphone, Target, Users } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const onboardingTracks = [
  {
    title: "Organisation",
    description: "Company details, location, industry, and operation scale.",
    icon: Building2,
  },
  {
    title: "Operations",
    description: "Equipment, facilities, products, and compliance needs.",
    icon: ClipboardList,
  },
  {
    title: "Workforce",
    description: "Staff count, roles, shift structure, and checklist ownership.",
    icon: Users,
  },
  {
    title: "Technology",
    description: "Devices, connectivity, existing tools, and integrations.",
    icon: MonitorSmartphone,
  },
  {
    title: "Goals",
    description: "Priority outcomes, timeline, budget, and custom checklist goals.",
    icon: Target,
  },
];

export default function OnboardingPage() {
  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <Card>
        <CardHeader className="space-y-3">
          <CardTitle className="text-2xl">Continue onboarding</CardTitle>
          <CardDescription className="max-w-2xl text-sm sm:text-base">
            Your signup details are already saved. The next onboarding pass will
            walk through the rest of your organisation setup so workflows,
            checklist recommendations, and team configuration can be tailored to
            how you operate.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Continue whenever you are ready. We will use this setup to tailor
            your workflows, checklist suggestions, and team configuration.
          </p>
          <Button asChild>
            <Link href="/dashboard">
              Back to dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {onboardingTracks.map((track) => (
          <Card key={track.title} className="bg-white">
            <CardHeader className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <track.icon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">{track.title}</CardTitle>
                <CardDescription className="mt-1">
                  {track.description}
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
