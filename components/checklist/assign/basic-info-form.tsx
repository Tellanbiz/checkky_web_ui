"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface BasicInfoFormProps {
  title: string;
  notes: string;
  priority: "high" | "mid" | "low";
  onTitleChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onPriorityChange: (value: "high" | "mid" | "low") => void;
}

export function BasicInfoForm({
  title,
  notes,
  priority,
  onTitleChange,
  onNotesChange,
  onPriorityChange,
}: BasicInfoFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Basic Information</CardTitle>
        <CardDescription>
          Give this assignment a clear title and description so team members understand its purpose.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Assignment Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="e.g., Daily Safety Check - Production Area"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Description</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Explain what this assignment is for and any special instructions..."
            rows={3}
          />
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <Label htmlFor="priority">Priority *</Label>
          <Select
            value={priority}
            onValueChange={onPriorityChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>High Priority</span>
                </div>
              </SelectItem>
              <SelectItem value="mid">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Medium Priority</span>
                </div>
              </SelectItem>
              <SelectItem value="low">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Low Priority</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
