"use client";

import { useMemo } from "react";
import { CalendarDays, Clock3, Plus, Repeat, Trash2 } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScheduleType, WorkflowParams } from "@/lib/services/workflows/models";
import { TIMEZONES } from "@/lib/shared/timezones";
import {
  DEFAULT_WORKFLOW_TIME,
  formatReminderText,
  formatWorkflowTimeList,
  from24HourWorkflowTime,
  leadTimeToReminderMinutes,
  parseWorkflowScheduleConfig,
  reminderMinutesToLeadTime,
  serializeWorkflowScheduleConfig,
  to24HourWorkflowTime,
} from "@/lib/workflow-schedule";

const WEEK_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface ScheduleFormProps {
  formData: Pick<
    WorkflowParams,
    | "scheduled_time"
    | "scheduled_times"
    | "reminder_minutes"
    | "schedule_type"
    | "day_of_week"
    | "day_of_month"
    | "month"
    | "timezone"
  >;
  onFormDataChange: (updates: Partial<WorkflowParams>) => void;
}

function getScheduleState(formData: ScheduleFormProps["formData"]) {
  const parsed = parseWorkflowScheduleConfig(formData.scheduled_time);
  const times =
    formData.scheduled_times && formData.scheduled_times.length > 0
      ? formData.scheduled_times
      : parsed.times;
  const reminderMinutes =
    typeof formData.reminder_minutes === "number"
      ? formData.reminder_minutes
      : parsed.reminderMinutes;

  return {
    times: times.length > 0 ? times : [DEFAULT_WORKFLOW_TIME],
    reminderMinutes,
  };
}

export function ScheduleForm({
  formData,
  onFormDataChange,
}: ScheduleFormProps) {
  const scheduleState = useMemo(() => getScheduleState(formData), [formData]);
  const showMultiTimeControls =
    formData.schedule_type === "daily" || formData.schedule_type === "weekly";

  const syncSchedule = (
    times: string[],
    reminderMinutes = scheduleState.reminderMinutes,
  ) => {
    onFormDataChange({
      scheduled_times: times,
      reminder_minutes: reminderMinutes,
      scheduled_time: serializeWorkflowScheduleConfig(times, reminderMinutes),
    });
  };

  const updateTime = (index: number, value: string) => {
    const nextTimes = [...scheduleState.times];
    nextTimes[index] = from24HourWorkflowTime(value);
    syncSchedule(nextTimes);
  };

  const addTime = () => {
    syncSchedule([...scheduleState.times, DEFAULT_WORKFLOW_TIME]);
  };

  const removeTime = (index: number) => {
    const nextTimes = scheduleState.times.filter(
      (_, currentIndex) => currentIndex !== index,
    );
    syncSchedule(nextTimes.length > 0 ? nextTimes : [DEFAULT_WORKFLOW_TIME]);
  };

  const updateReminderLeadTime = (value: string) => {
    syncSchedule(scheduleState.times, leadTimeToReminderMinutes(value));
  };

  const getScheduleDescription = () => {
    const timeLabel = formatWorkflowTimeList(scheduleState.times);
    const reminderLabel = formatReminderText(scheduleState.reminderMinutes);

    switch (formData.schedule_type) {
      case "daily":
        return `Runs every day at ${timeLabel}. ${reminderLabel === "No reminder" ? "No reminder will be sent before the run." : `Reminder goes out ${reminderLabel.toLowerCase()}.`}`;
      case "weekly":
        return `Runs every ${WEEK_DAYS[formData.day_of_week ?? 1]} at ${timeLabel}. ${reminderLabel === "No reminder" ? "No reminder will be sent before the run." : `Reminder goes out ${reminderLabel.toLowerCase()}.`}`;
      case "monthly":
        return `Runs on day ${formData.day_of_month} of each month at ${formatWorkflowTimeList([scheduleState.times[0]])}.`;
      case "yearly":
        return `Runs every year on ${formData.month}/${formData.day_of_month} at ${formatWorkflowTimeList([scheduleState.times[0]])}.`;
      default:
        return "";
    }
  };

  return (
    <Card className="bg-white">
      <CardHeader className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-foreground">
            <Clock3 className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg">Schedule</CardTitle>
            <CardDescription>
              Pick how often the workflow runs, which exact times it should
              fire, and how long before the run the reminder should go out.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="schedule-type">Frequency</Label>
            <Select
              value={formData.schedule_type}
              onValueChange={(value: ScheduleType) =>
                onFormDataChange({ schedule_type: value })
              }
            >
              <SelectTrigger id="schedule-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">
                  <div className="flex items-center gap-2">
                    <Repeat className="h-4 w-4" />
                    Daily
                  </div>
                </SelectItem>
                <SelectItem value="weekly">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Weekly
                  </div>
                </SelectItem>
                <SelectItem value="monthly">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Monthly
                  </div>
                </SelectItem>
                <SelectItem value="yearly">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Yearly
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select
              value={formData.timezone}
              onValueChange={(value) => onFormDataChange({ timezone: value })}
            >
              <SelectTrigger id="timezone">
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
        </div>

        {formData.schedule_type === "weekly" && (
          <div className="space-y-2">
            <Label>Run day</Label>
            <Select
              value={String(formData.day_of_week ?? 1)}
              onValueChange={(value) =>
                onFormDataChange({ day_of_week: Number.parseInt(value, 10) })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WEEK_DAYS.map((day, index) => (
                  <SelectItem key={day} value={String(index)}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {showMultiTimeControls ? (
          <div className="space-y-4 rounded-xl border bg-white p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <Label className="text-sm font-semibold">
                  Run times
                </Label>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add every time this workflow should run on the selected day.
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addTime}>
                <Plus className="mr-2 h-4 w-4" />
                Add another time
              </Button>
            </div>

            <div className="space-y-3">
              {scheduleState.times.map((time, index) => (
                <div
                  key={`${time}-${index}`}
                  className="flex items-center gap-3 rounded-xl border bg-white p-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground">
                    <Clock3 className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Run {index + 1}
                    </Label>
                    <Input
                      type="time"
                      value={to24HourWorkflowTime(time)}
                      onChange={(event) => updateTime(index, event.target.value)}
                    />
                  </div>
                  {scheduleState.times.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTime(index)}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-[minmax(0,220px)_1fr]">
              <div className="space-y-2">
                <Label htmlFor="reminder-lead-time">Reminder before run</Label>
                <Input
                  id="reminder-lead-time"
                  type="time"
                  step="300"
                  value={reminderMinutesToLeadTime(scheduleState.reminderMinutes)}
                  onChange={(event) =>
                    updateReminderLeadTime(event.target.value)
                  }
                />
              </div>
              <div className="rounded-xl border bg-white px-4 py-3 text-sm text-muted-foreground">
                Use `00:00` if you do not want a reminder. For example, `00:30`
                sends the reminder 30 minutes before each run, while `02:00`
                sends it 2 hours before.
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {scheduleState.times.map((time) => (
                <Badge key={time} variant="secondary" className="rounded-full">
                  {time.replace(/([AP]M)$/, " $1")}
                </Badge>
              ))}
              <Badge variant="outline" className="rounded-full">
                {formatReminderText(scheduleState.reminderMinutes)}
              </Badge>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="scheduled-time">Run time</Label>
            <Input
              id="scheduled-time"
              type="time"
              value={to24HourWorkflowTime(scheduleState.times[0])}
              onChange={(event) =>
                syncSchedule([from24HourWorkflowTime(event.target.value)])
              }
              required
            />
          </div>
        )}

        {formData.schedule_type === "monthly" && (
          <div className="space-y-2">
            <Label>Day of month</Label>
            <Select
              value={formData.day_of_month.toString()}
              onValueChange={(value) =>
                onFormDataChange({ day_of_month: Number.parseInt(value, 10) })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 31 }, (_, index) => index + 1).map((day) => (
                  <SelectItem key={day} value={day.toString()}>
                    Day {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {formData.schedule_type === "yearly" && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Month</Label>
              <Select
                value={formData.month.toString()}
                onValueChange={(value) =>
                  onFormDataChange({ month: Number.parseInt(value, 10) })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ].map((month, index) => (
                    <SelectItem key={month} value={String(index + 1)}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Day of month</Label>
              <Select
                value={formData.day_of_month.toString()}
                onValueChange={(value) =>
                  onFormDataChange({ day_of_month: Number.parseInt(value, 10) })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 31 }, (_, index) => index + 1).map((day) => (
                    <SelectItem key={day} value={day.toString()}>
                      Day {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <Alert className="bg-white">
          <AlertDescription className="text-foreground">
            <span className="font-semibold">Schedule preview:</span>{" "}
            {getScheduleDescription()}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
