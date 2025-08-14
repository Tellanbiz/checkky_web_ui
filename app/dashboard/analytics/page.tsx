"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DatePickerWithRange } from "@/components/common/date-range-picker";
import {
  Download,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const performanceData = [
  { month: "Jan", completed: 85, pending: 15, overdue: 5 },
  { month: "Feb", completed: 88, pending: 12, overdue: 3 },
  { month: "Mar", completed: 92, pending: 8, overdue: 2 },
  { month: "Apr", completed: 87, pending: 13, overdue: 4 },
  { month: "May", completed: 94, pending: 6, overdue: 1 },
  { month: "Jun", completed: 89, pending: 11, overdue: 3 },
];

const categoryData = [
  { name: "Livestock", value: 35, color: "#16A34A" },
  { name: "Crop Farming", value: 28, color: "#3B82F6" },
  { name: "Flower Farming", value: 22, color: "#F59E0B" },
  { name: "General", value: 15, color: "#8B5CF6" },
];

const teamPerformance = [
  { name: "John Smith", completed: 45, quality: 95, efficiency: 88 },
  { name: "Sarah Johnson", completed: 38, quality: 92, efficiency: 90 },
  { name: "Mike Wilson", completed: 28, quality: 85, efficiency: 82 },
  { name: "Emma Davis", completed: 33, quality: 98, efficiency: 94 },
  { name: "Lisa Brown", completed: 22, quality: 87, efficiency: 79 },
];

export default function AnalyticsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Analytics & Reports
        </h2>
        <div className="flex items-center space-x-2">
          <DatePickerWithRange />
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89.5%</div>
            <p className="text-xs text-green-600">+2.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Response Time
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4h</div>
            <p className="text-xs text-green-600">-0.3h from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">91.2%</div>
            <p className="text-xs text-green-600">+1.8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-red-600">+2 from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
            <CardDescription>
              Monthly completion rates over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#16A34A"
                    name="Completed"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="pending"
                    stroke="#F59E0B"
                    name="Pending"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="overdue"
                    stroke="#EF4444"
                    name="Overdue"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>
              Checklist distribution by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Team Performance Analysis</CardTitle>
          <CardDescription>
            Individual team member performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={teamPerformance}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="completed"
                  fill="#16A34A"
                  name="Tasks Completed"
                />
                <Bar dataKey="quality" fill="#3B82F6" name="Quality Score" />
                <Bar
                  dataKey="efficiency"
                  fill="#F59E0B"
                  name="Efficiency Score"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Reports */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamPerformance
                .sort((a, b) => b.quality - a.quality)
                .slice(0, 3)
                .map((member, index) => (
                  <div
                    key={member.name}
                    className="flex items-center space-x-3"
                  >
                    <Badge
                      variant="outline"
                      className="w-6 h-6 p-0 flex items-center justify-center"
                    >
                      {index + 1}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Quality: {member.quality}%
                      </p>
                    </div>
                    <Badge variant="secondary">{member.completed} tasks</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { area: "Equipment Maintenance", risk: "High", count: 3 },
                { area: "Safety Protocols", risk: "Medium", count: 2 },
                { area: "Documentation", risk: "Low", count: 3 },
              ].map((item) => (
                <div
                  key={item.area}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">{item.area}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.count} issues
                    </p>
                  </div>
                  <Badge
                    variant={
                      item.risk === "High"
                        ? "destructive"
                        : item.risk === "Medium"
                        ? "secondary"
                        : "outline"
                    }
                    className={
                      item.risk === "Medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : ""
                    }
                  >
                    {item.risk}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-800">
                  Completion rates improved by 5% this month
                </p>
                <p className="text-xs text-green-600">
                  Great work on livestock inspections!
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm font-medium text-yellow-800">
                  Equipment checks need attention
                </p>
                <p className="text-xs text-yellow-600">
                  3 overdue maintenance tasks
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-800">
                  New team member onboarded
                </p>
                <p className="text-xs text-blue-600">
                  Lisa Brown joined the auditing team
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
