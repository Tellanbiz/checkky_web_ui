"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { MonthlyTasks } from "@/lib/services/reports/models";

interface DashboardChartsProps {
  yearlyData?: MonthlyTasks | null;
}

const priorityData = [
  { name: "Major Must", value: 45, color: "#EF4444" },
  { name: "Minor Must", value: 30, color: "#F59E0B" },
  { name: "Optional", value: 25, color: "#10B981" },
];

export function DashboardCharts({ yearlyData }: DashboardChartsProps) {
  // Transform yearly data into chart format
  const completionData = yearlyData
    ? Object.entries(yearlyData).map(([month, data]) => ({
        name: month,
        completed: data.completed,
        pending: data.pending,
      }))
    : [
        { name: "Jan", completed: 0, pending: 0 },
        { name: "Feb", completed: 0, pending: 0 },
        { name: "Mar", completed: 0, pending: 0 },
        { name: "Apr", completed: 0, pending: 0 },
        { name: "May", completed: 0, pending: 0 },
        { name: "Jun", completed: 0, pending: 0 },
        { name: "Jul", completed: 0, pending: 0 },
        { name: "Aug", completed: 0, pending: 0 },
        { name: "Sep", completed: 0, pending: 0 },
        { name: "Oct", completed: 0, pending: 0 },
        { name: "Nov", completed: 0, pending: 0 },
        { name: "Dec", completed: 0, pending: 0 },
      ];

  return (
    <div className="space-y-6">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={completionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="completed" fill="#16A34A" name="Completed" />
            <Bar dataKey="pending" fill="#E5E7EB" name="Pending" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Priority Breakdown</h4>
          <div className="h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Legend</h4>
          {priorityData.map((item) => (
            <div key={item.name} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs">
                {item.name}: {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
