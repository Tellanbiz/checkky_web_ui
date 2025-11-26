"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface BasicInfoFormProps {
  workflowName: string;
  workflowDescription: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export function BasicInfoForm({
  workflowName,
  workflowDescription,
  onNameChange,
  onDescriptionChange,
}: BasicInfoFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Basic Information</CardTitle>
        <CardDescription>
          Give your workflow a clear name and description so team members understand its purpose.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="workflow-name">Workflow Name *</Label>
          <Input
            id="workflow-name"
            value={workflowName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="e.g., Daily Safety Check - Production Area"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="workflow-description">Description</Label>
          <Textarea
            id="workflow-description"
            value={workflowDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Explain what this workflow does and why it's important..."
            rows={3}
          />
        </div>

        {/* Basic Info Tips */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Tips:</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-gray-400 mr-2">•</span>
              <span>Use descriptive names to easily identify workflows later</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-400 mr-2">•</span>
              <span>Include the area or process in the name for clarity</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-400 mr-2">•</span>
              <span>Consider adding frequency (Daily, Weekly, Monthly) to the name</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
