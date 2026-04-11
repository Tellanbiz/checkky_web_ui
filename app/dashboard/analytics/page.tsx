"use client";

import { useState, useEffect } from "react";
import type { DateRange } from "react-day-picker";
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
  Loader2,
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
import {
  getAnalyticsData,
  exportAnalyticsData,
  type AnalyticsData,
} from "@/lib/services/analytics/actions";
import { downloadReportAction } from "@/lib/services/reports/actions";
import { ReportPreviewModal } from "@/components/modals/report-preview-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export default function AnalyticsPage() {
  const { toast } = useToast();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [reportPreview, setReportPreview] = useState<{
    open: boolean;
    data: string | null;
    filename: string;
    contentType: string;
    loading: boolean;
  }>({ open: false, data: null, filename: "", contentType: "", loading: false });

  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const params = {
        start_date: dateRange?.from?.toISOString().split("T")[0],
        end_date: dateRange?.to?.toISOString().split("T")[0],
      };
      const data = await getAnalyticsData(params);
      setAnalyticsData(data);
    } catch (error) {
      console.error("Failed to load analytics data:", error);
      toast({
        title: "Error",
        description: "Failed to load analytics data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: "json" | "csv" = "json") => {
    try {
      const params = {
        start_date: dateRange?.from?.toISOString().split("T")[0],
        end_date: dateRange?.to?.toISOString().split("T")[0],
      };
      await exportAnalyticsData(format, params);
      toast({
        title: "Success",
        description: `Analytics data exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error("Failed to export analytics:", error);
      toast({
        title: "Error",
        description: "Failed to export analytics data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadReport = async (
    type: "overview" | "yearly" | "priority" | "completed-summary" | "member-performance" | "group-compliance",
  ) => {
    try {
      setReportPreview({ open: true, data: null, filename: "", contentType: "", loading: true });
      const result = await downloadReportAction({
        type,
        format: "pdf",
        year: new Date().getFullYear(),
        ...(dateRange?.from ? { start_date: dateRange.from.toISOString().split("T")[0] } : {}),
        ...(dateRange?.to ? { end_date: dateRange.to.toISOString().split("T")[0] } : {}),
      });
      if (!result.success || !result.data) throw new Error(result.error ?? "Download failed");
      const reportNames: Record<string, string> = {
        overview: "Compliance Overview Report",
        yearly: `Yearly Report ${new Date().getFullYear()}`,
        priority: "Priority Breakdown Report",
        "completed-summary": "Completed Checklists Summary",
        "member-performance": "Member Performance Report",
        "group-compliance": "Group Compliance Report",
      };
      const dateStr = new Date().toISOString().split("T")[0];
      setReportPreview({
        open: true,
        data: result.data,
        filename: `${reportNames[type]} - ${dateStr}.pdf`,
        contentType: result.contentType ?? "application/pdf",
        loading: false,
      });
    } catch (error) {
      console.error("Failed to download report:", error);
      setReportPreview({ open: false, data: null, filename: "", contentType: "", loading: false });
      toast({ title: "Error", description: "Failed to generate report. Please try again.", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            <p className="text-gray-500">Loading analytics data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-500">No analytics data available</p>
          </div>
        </div>
      </div>
    );
  }
  // Ensure data arrays are never null and add additional safety checks
  const safePerformanceData = (analyticsData?.performance_data || []).filter(
    Boolean
  );
  const safeCategoryData = (analyticsData?.category_data || []).filter(Boolean);
  const safeTeamPerformance = (analyticsData?.team_performance || []).filter(
    Boolean
  );

  // Additional safety: don't render charts if analyticsData is not fully loaded
  if (
    !analyticsData ||
    !Array.isArray(analyticsData.performance_data) ||
    !Array.isArray(analyticsData.category_data) ||
    !Array.isArray(analyticsData.team_performance)
  ) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-500">Loading analytics data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Analytics & Reports
        </h2>
        <div className="flex items-center space-x-2">
          <DatePickerWithRange
            value={dateRange}
            onChange={(range: DateRange | undefined) => setDateRange(range)}
          />
          <Button onClick={() => handleExport("csv")} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleDownloadReport("overview")}>
                Overview Report
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownloadReport("yearly")}>
                Yearly Report
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownloadReport("priority")}>
                Priority Breakdown
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownloadReport("completed-summary")}>
                Completed Summary
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownloadReport("member-performance")}>
                Member Performance
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownloadReport("group-compliance")}>
                Group Compliance
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
            <div className="text-2xl font-bold">
              {analyticsData.completion_rate.toFixed(1)}%
            </div>
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
            <div className="text-2xl font-bold">
              {analyticsData.avg_response_time.toFixed(1)}h
            </div>
            <p className="text-xs text-green-600">-0.3h from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.total_checklists}
            </div>
            <p className="text-xs text-green-600">+12 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.active_tasks}
            </div>
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
              {safePerformanceData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={safePerformanceData}>
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
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No performance data available</p>
                </div>
              )}
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
              {safeCategoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={safeCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: any) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {safeCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No category data available</p>
                </div>
              )}
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
            {safeTeamPerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={safeTeamPerformance}
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
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">
                  No team performance data available
                </p>
              </div>
            )}
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
              {safeTeamPerformance
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

      <ReportPreviewModal
        isOpen={reportPreview.open}
        onClose={() => setReportPreview((p) => ({ ...p, open: false }))}
        reportData={reportPreview.data}
        filename={reportPreview.filename}
        contentType={reportPreview.contentType}
        loading={reportPreview.loading}
      />
    </div>
  );
}
