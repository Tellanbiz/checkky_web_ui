"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckList } from "@/lib/services/checklist/models";
import { Search, FileText, Clock, Users } from "lucide-react";

interface ChecklistSelectFormProps {
  selectedChecklistId: string;
  availableChecklists: CheckList[];
  onChecklistChange: (value: string) => void;
}

export function ChecklistSelectForm({
  selectedChecklistId,
  availableChecklists,
  onChecklistChange,
}: ChecklistSelectFormProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredChecklists = availableChecklists.filter(checklist =>
    checklist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    checklist.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedChecklist = availableChecklists.find(c => c.id === selectedChecklistId);

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className="text-lg">Select Checklist Template</CardTitle>
          <CardDescription>
            Choose the checklist template that will be automatically assigned to team members.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search templates by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Selected Template Display */}
        {selectedChecklist && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-900">Selected Template:</p>
                <p className="text-sm text-green-800 font-semibold">{selectedChecklist.name}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onChecklistChange('')}
                className="text-green-600 hover:text-green-800"
              >
                Clear
              </Button>
            </div>
          </div>
        )}

        {/* Template Display */}
        <div className="grid grid-cols-2 gap-4 max-h-64 overflow-y-auto">
          {filteredChecklists.length === 0 ? (
            <div className="col-span-2 text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p>No templates found matching "{searchTerm}"</p>
            </div>
          ) : (
            filteredChecklists.map((checklist) => (
              <div
                key={checklist.id}
                onClick={() => onChecklistChange(checklist.id)}
                className={`
                  cursor-pointer transition-all duration-200
                  p-4 border rounded-lg hover:shadow-md ${
                    selectedChecklistId === checklist.id
                      ? "border-green-500 bg-green-50 shadow-sm"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }
                `}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{checklist.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{checklist.description}</p>
                    </div>
                    <div className="ml-3 flex-shrink-0">
                      {selectedChecklistId === checklist.id && (
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      <span>Template</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Automated</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Template Count */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>{filteredChecklists.length} template{filteredChecklists.length !== 1 ? 's' : ''} available</span>
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchTerm('')}
              className="text-gray-500 hover:text-gray-700"
            >
              Clear search
            </Button>
          )}
        </div>

        {/* Template Tips */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Tips:</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-gray-400 mr-2">•</span>
              <span>Choose templates that match the workflow's purpose and location</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-400 mr-2">•</span>
              <span>Consider the complexity and time required for completion</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-400 mr-2">•</span>
              <span>Ensure the template has all necessary steps for the process</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
