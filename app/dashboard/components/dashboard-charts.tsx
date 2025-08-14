"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts"

const completionData = [
  { name: "Jan", completed: 65, pending: 35 },
  { name: "Feb", completed: 72, pending: 28 },
  { name: "Mar", completed: 78, pending: 22 },
  { name: "Apr", completed: 85, pending: 15 },
  { name: "May", completed: 87, pending: 13 },
  { name: "Jun", completed: 89, pending: 11 },
]

const priorityData = [
  { name: "Major Must", value: 45, color: "#EF4444" },
  { name: "Minor Must", value: 30, color: "#F59E0B" },
  { name: "Optional", value: 25, color: "#10B981" },
]

export function DashboardCharts() {
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
                <Pie data={priorityData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value">
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
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs">
                {item.name}: {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
