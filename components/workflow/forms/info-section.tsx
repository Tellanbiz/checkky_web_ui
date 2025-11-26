"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Info, Settings, Lightbulb } from "lucide-react";

export function InfoSection() {
  return (
    <>
      {/* Tips & Tricks */}
      <Card className="bg-gray-50 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg text-gray-800">
            <Lightbulb className="h-5 w-5" />
            <span>Pro Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-700 space-y-3">
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-gray-500 mr-2">•</span>
              <span className="text-sm">Workflows automate repetitive tasks and save time</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-500 mr-2">•</span>
              <span className="text-sm">Create a daily safety inspection workflow that automatically assigns the checklist to your safety team every morning</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-500 mr-2">•</span>
              <span className="text-sm">Set schedules during business hours for better team compliance</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-500 mr-2">•</span>
              <span className="text-sm">Assign multiple members for critical safety checklists to ensure coverage</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card className="bg-gray-50 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg text-gray-800">
            <Settings className="h-5 w-5" />
            <span>How It Works</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-700 space-y-3">
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-800">Automated Process:</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">System triggers at the scheduled time based on your timezone</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Automatically creates a new checklist instance from your selected template</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Assigns the checklist to all selected team members</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Sends notifications to assigned members</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Tracks completion and sends reminders if needed</span>
              </li>
            </ul>
          </div>
          
          <Separator className="bg-gray-300" />
          
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-800">Best Practices:</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Use descriptive names to easily identify workflows later</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Test with daily schedules first, then adjust as needed</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Consider team workload when setting assignment frequencies</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Monitor workflow completion rates to optimize scheduling</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
