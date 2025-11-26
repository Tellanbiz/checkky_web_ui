"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Clock, Repeat, CalendarDays } from "lucide-react";
import { ScheduleType, WorkflowParams } from "@/lib/services/workflows/models";
import { TIMEZONES, getDefaultTimezone } from "@/lib/shared/timezones";

interface ScheduleFormProps {
  formData: Pick<WorkflowParams, 'ScheduledTime' | 'ScheduleType' | 'DayOfWeek' | 'DayOfMonth' | 'Month' | 'Timezone'>;
  onFormDataChange: (updates: Partial<WorkflowParams>) => void;
}

export function ScheduleForm({
  formData,
  onFormDataChange,
}: ScheduleFormProps) {
  const getScheduleDescription = () => {
    switch (formData.ScheduleType) {
      case "daily":
        return "Every day at " + formData.ScheduledTime;
      case "weekly":
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return `Every ${days[formData.DayOfWeek]} at ${formData.ScheduledTime}`;
      case "monthly":
        return `On day ${formData.DayOfMonth} of each month at ${formData.ScheduledTime}`;
      case "yearly":
        return `On ${formData.Month}/${formData.DayOfMonth} each year at ${formData.ScheduledTime}`;
      default:
        return "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Schedule Configuration</CardTitle>
        <CardDescription>
          Set when and how often this workflow should run. The system will automatically create and assign checklists based on this schedule.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="schedule-type">Schedule Type *</Label>
            <Select 
              value={formData.ScheduleType} 
              onValueChange={(value: ScheduleType) => 
                onFormDataChange({ ScheduleType: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">
                  <div className="flex items-center space-x-2">
                    <Repeat className="h-4 w-4" />
                    <span>Daily</span>
                  </div>
                </SelectItem>
                <SelectItem value="weekly">
                  <div className="flex items-center space-x-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>Weekly</span>
                  </div>
                </SelectItem>
                <SelectItem value="monthly">
                  <div className="flex items-center space-x-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>Monthly</span>
                  </div>
                </SelectItem>
                <SelectItem value="yearly">
                  <div className="flex items-center space-x-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>Yearly</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scheduled-time">Scheduled Time *</Label>
            <Input
              id="scheduled-time"
              type="time"
              value={formData.ScheduledTime.slice(0, 5)}
              onChange={(e) => onFormDataChange({ 
                ScheduledTime: e.target.value + ":00" 
              })}
              required
            />
          </div>
        </div>

        {/* Schedule-specific options */}
        {formData.ScheduleType === "weekly" && (
          <div className="space-y-2">
            <Label>Day of Week</Label>
            <Select 
              value={formData.DayOfWeek.toString()} 
              onValueChange={(value) => 
                onFormDataChange({ DayOfWeek: parseInt(value) })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Sunday</SelectItem>
                <SelectItem value="1">Monday</SelectItem>
                <SelectItem value="2">Tuesday</SelectItem>
                <SelectItem value="3">Wednesday</SelectItem>
                <SelectItem value="4">Thursday</SelectItem>
                <SelectItem value="5">Friday</SelectItem>
                <SelectItem value="6">Saturday</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {formData.ScheduleType === "monthly" && (
          <div className="space-y-2">
            <Label>Day of Month</Label>
            <Select 
              value={formData.DayOfMonth.toString()} 
              onValueChange={(value) => 
                onFormDataChange({ DayOfMonth: parseInt(value) })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                  <SelectItem key={day} value={day.toString()}>
                    Day {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {formData.ScheduleType === "yearly" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Month</Label>
              <Select 
                value={formData.Month.toString()} 
                onValueChange={(value) => 
                  onFormDataChange({ Month: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">January</SelectItem>
                  <SelectItem value="2">February</SelectItem>
                  <SelectItem value="3">March</SelectItem>
                  <SelectItem value="4">April</SelectItem>
                  <SelectItem value="5">May</SelectItem>
                  <SelectItem value="6">June</SelectItem>
                  <SelectItem value="7">July</SelectItem>
                  <SelectItem value="8">August</SelectItem>
                  <SelectItem value="9">September</SelectItem>
                  <SelectItem value="10">October</SelectItem>
                  <SelectItem value="11">November</SelectItem>
                  <SelectItem value="12">December</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Day of Month</Label>
              <Select 
                value={formData.DayOfMonth.toString()} 
                onValueChange={(value) => 
                  onFormDataChange({ DayOfMonth: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <SelectItem key={day} value={day.toString()}>
                      Day {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Timezone */}
        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Select 
            value={formData.Timezone} 
            onValueChange={(value) => onFormDataChange({ Timezone: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select timezone..." />
            </SelectTrigger>
            <SelectContent>
              {TIMEZONES.map((timezone) => (
                <SelectItem key={timezone.value} value={timezone.value}>
                  {timezone.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Schedule Preview */}
        <Alert className="bg-gray-50 border-gray-200">
          <Clock className="h-4 w-4 text-gray-600" />
          <AlertDescription className="text-gray-700">
            <strong>Schedule Preview:</strong> {getScheduleDescription()}
          </AlertDescription>
        </Alert>

        {/* Schedule Tips */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Tips:</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-gray-400 mr-2">•</span>
              <span>Set schedules during business hours for better team compliance</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-400 mr-2">•</span>
              <span>Consider team workload when setting assignment frequencies</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-400 mr-2">•</span>
              <span>Test with daily schedules first, then adjust as needed</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
