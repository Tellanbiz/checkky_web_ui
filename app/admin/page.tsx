"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Users,
  Building2,
  CreditCard,
  Activity,
  AlertTriangle,
  CheckCircle,
  Server,
  Database,
  Zap,
} from "lucide-react"
import { useState } from "react"
import { AdminReviewModal } from "../components/modals/admin-review-modal"
import { ManageUsersModal } from "../components/modals/manage-users-modal"
import { RolePermissionsModal } from "../components/modals/role-permissions-modal"
import { BillingResolveModal } from "../components/modals/billing-resolve-modal"
import { SystemLogsModal } from "../components/modals/system-logs-modal"
import { DatabaseToolsModal } from "../components/modals/database-tools-modal"

const AdminPage = () => {
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewType, setReviewType] = useState<"companies" | "billing" | "tickets" | "updates">("companies")
  const [showManageUsersModal, setShowManageUsersModal] = useState(false)
  const [showRolePermissionsModal, setShowRolePermissionsModal] = useState(false)
  const [showBillingResolveModal, setShowBillingResolveModal] = useState(false)
  const [showSystemLogsModal, setShowSystemLogsModal] = useState(false)
  const [showDatabaseToolsModal, setShowDatabaseToolsModal] = useState(false)

  const systemStats = [
    { label: "Server Uptime", value: "99.9%", status: "good" },
    { label: "Database Health", value: "Optimal", status: "good" },
    { label: "API Response Time", value: "145ms", status: "good" },
    { label: "Storage Used", value: "67%", status: "warning" },
  ]

  const recentActivities = [
    {
      type: "user_signup",
      message: "New user registered: john.doe@newcompany.com",
      time: "2 minutes ago",
      status: "info",
    },
    {
      type: "payment",
      message: "Payment received from Green Valley Farms ($2,400)",
      time: "15 minutes ago",
      status: "success",
    },
    {
      type: "error",
      message: "Failed login attempt detected from suspicious IP",
      time: "1 hour ago",
      status: "warning",
    },
    {
      type: "system",
      message: "Database backup completed successfully",
      time: "2 hours ago",
      status: "success",
    },
    {
      type: "billing",
      message: "Subscription renewal reminder sent to 5 companies",
      time: "3 hours ago",
      status: "info",
    },
  ]

  const pendingActions = [
    {
      title: "Review Company Applications",
      description: "3 new companies awaiting approval",
      priority: "high",
      count: 3,
    },
    {
      title: "Process Billing Issues",
      description: "2 failed payment notifications",
      priority: "high",
      count: 2,
    },
    {
      title: "User Support Tickets",
      description: "8 open support tickets",
      priority: "medium",
      count: 8,
    },
    {
      title: "System Updates",
      description: "Security patches available",
      priority: "medium",
      count: 1,
    },
  ]

  const handleReviewAction = (actionTitle: string) => {
    switch (actionTitle) {
      case "Review Company Applications":
        setReviewType("companies")
        setShowReviewModal(true)
        break
      case "Process Billing Issues":
        setReviewType("billing")
        setShowReviewModal(true)
        break
      case "User Support Tickets":
        setReviewType("tickets")
        setShowReviewModal(true)
        break
      case "System Updates":
        setReviewType("updates")
        setShowReviewModal(true)
        break
      default:
        console.log("Reviewing:", actionTitle)
    }
  }

  const handleQuickAction = (actionTitle: string) => {
    switch (actionTitle) {
      case "Manage Users":
        setShowManageUsersModal(true)
        break
      case "Role Permissions":
        setShowRolePermissionsModal(true)
        break
      case "Review Applications":
        setReviewType("companies")
        setShowReviewModal(true)
        break
      case "Billing Overview":
        setShowBillingResolveModal(true)
        break
      case "System Logs":
        setShowSystemLogsModal(true)
        break
      case "Database Tools":
        setShowDatabaseToolsModal(true)
        break
      default:
        console.log("Action:", actionTitle)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <CheckCircle className="w-3 h-3 mr-1" />
            All Systems Operational
          </Badge>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">+3 new this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$47,200</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Excellent</div>
            <p className="text-xs text-muted-foreground">99.9% uptime</p>
          </CardContent>
        </Card>
      </div>

      {/* System Status and Pending Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Real-time system health monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {stat.label === "Server Uptime" && <Server className="h-4 w-4 text-muted-foreground" />}
                    {stat.label === "Database Health" && <Database className="h-4 w-4 text-muted-foreground" />}
                    {stat.label === "API Response Time" && <Zap className="h-4 w-4 text-muted-foreground" />}
                    {stat.label === "Storage Used" && <Activity className="h-4 w-4 text-muted-foreground" />}
                    <span className="text-sm font-medium">{stat.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{stat.value}</span>
                    <div
                      className={`h-2 w-2 rounded-full ${
                        stat.status === "good"
                          ? "bg-green-500"
                          : stat.status === "warning"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Actions</CardTitle>
            <CardDescription>Items requiring admin attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingActions.map((action, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{action.title}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={action.priority === "high" ? "destructive" : "secondary"}
                      className={action.priority === "high" ? "" : "bg-yellow-100 text-yellow-800"}
                    >
                      {action.count}
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => handleReviewAction(action.title)}>
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent System Activity</CardTitle>
          <CardDescription>Latest system events and user activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div
                  className={`p-2 rounded-full ${
                    activity.status === "success"
                      ? "bg-green-100"
                      : activity.status === "warning"
                        ? "bg-yellow-100"
                        : activity.status === "error"
                          ? "bg-red-100"
                          : "bg-blue-100"
                  }`}
                >
                  {activity.status === "success" && <CheckCircle className="h-4 w-4 text-green-600" />}
                  {activity.status === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                  {activity.status === "error" && <AlertTriangle className="h-4 w-4 text-red-600" />}
                  {activity.status === "info" && <Activity className="h-4 w-4 text-blue-600" />}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              className="w-full bg-transparent"
              variant="outline"
              onClick={() => handleQuickAction("Manage Users")}
            >
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
            <Button
              className="w-full bg-transparent"
              variant="outline"
              onClick={() => handleQuickAction("Role Permissions")}
            >
              <Shield className="mr-2 h-4 w-4" />
              Role Permissions
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Company Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              className="w-full bg-transparent"
              variant="outline"
              onClick={() => handleQuickAction("Review Applications")}
            >
              <Building2 className="mr-2 h-4 w-4" />
              Review Applications
            </Button>
            <Button
              className="w-full bg-transparent"
              variant="outline"
              onClick={() => handleQuickAction("Billing Overview")}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Billing Overview
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Tools</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              className="w-full bg-transparent"
              variant="outline"
              onClick={() => handleQuickAction("System Logs")}
            >
              <Activity className="mr-2 h-4 w-4" />
              System Logs
            </Button>
            <Button
              className="w-full bg-transparent"
              variant="outline"
              onClick={() => handleQuickAction("Database Tools")}
            >
              <Database className="mr-2 h-4 w-4" />
              Database Tools
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* All Modals */}
      <AdminReviewModal isOpen={showReviewModal} onClose={() => setShowReviewModal(false)} type={reviewType} />
      <ManageUsersModal isOpen={showManageUsersModal} onClose={() => setShowManageUsersModal(false)} />
      <RolePermissionsModal isOpen={showRolePermissionsModal} onClose={() => setShowRolePermissionsModal(false)} />
      <BillingResolveModal isOpen={showBillingResolveModal} onClose={() => setShowBillingResolveModal(false)} />
      <SystemLogsModal isOpen={showSystemLogsModal} onClose={() => setShowSystemLogsModal(false)} />
      <DatabaseToolsModal isOpen={showDatabaseToolsModal} onClose={() => setShowDatabaseToolsModal(false)} />
    </div>
  )
}

export default AdminPage
