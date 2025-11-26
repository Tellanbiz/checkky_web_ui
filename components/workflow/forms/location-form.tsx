"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface Section {
  id: string;
  name: string;
  description: string;
}

interface LocationFormProps {
  selectedSectionId: string;
  availableSections: Section[];
  onSectionChange: (value: string) => void;
}

export function LocationForm({
  selectedSectionId,
  availableSections,
  onSectionChange,
}: LocationFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Location Assignment</CardTitle>
        <CardDescription>
          Select the area or section where this workflow will be active.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={selectedSectionId} onValueChange={onSectionChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a location..." />
          </SelectTrigger>
          <SelectContent>
            {availableSections.map((section) => (
              <SelectItem key={section.id} value={section.id}>
                <div className="flex flex-col">
                  <span className="font-medium">{section.name}</span>
                  <span className="text-sm text-muted-foreground">{section.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Location Tips */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Tips:</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-gray-400 mr-2">•</span>
              <span>Be specific about the area to avoid confusion</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-400 mr-2">•</span>
              <span>Consider creating separate workflows for different locations</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-400 mr-2">•</span>
              <span>Match the location to the assigned team members' work areas</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
