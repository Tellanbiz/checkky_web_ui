"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  Search,
  Download,
  Clock,
  User,
  Server,
  Database,
  Shield,
  Zap,
} from "lucide-react"
import { useState } from "react"

interface SystemLogsModalProps {
  isOpen: boolean
  onClose: () => void
}

interface LogEntry {
  id: string
  timestamp: string
  level: "info" | "warning" | "error" | "success"
  category: string
  message: string
  user?: string
  ip?: string
  details?: string
}

export function SystemLogsModal({ isOpen, onClose }: SystemLogsModalProps) {
  const [selectedTab, setSelectedTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const systemLogs: LogEntry[] = [
    {
      id: "1",
      timestamp: "2024-01-15 14:32:15",
      level: "error",
      category: "Authentication",
      message: "Failed login attempt detected",
      user: "unknown",
      ip: "192.168.1.100",
      details: "Multiple failed login attempts from suspicious IP address",
    },
    {
      id: "2",
      timestamp: "2024-01-15 14:30:22",
      level: "success",
      category: "Payment",
      message: "Payment processed successfully",
      user: "sarah@greenvalley.com",
      ip: "10.0.0.45",
      details: "Payment of $2,400 processed for Green Valley Farms",
    },
    {
      id: "3",
      timestamp: "2024-01-15 14:28:10",
      level: "info",
      category: "User Management",
      message: "New user registered",
      user: "john.doe@newcompany.com",
      ip: "172.16.0.23",
      details: "User registration completed for New Company Ltd",
    },
    {
      id: "4",
      timestamp: "2024-01-15 14:25:45",
      level: "warning",
      category: "System",
      message: "High memory usage detected",
      details: "Memory usage reached 85% on server node-2",
    },
    {
      id: "5",
      timestamp: "2024-01-15 14:20:33",
      level: "info",
      category: "Database",
      message: "Database backup completed",
      details: "Scheduled backup completed successfully - 2.3GB",
    },
    {
      id: "6",
      timestamp: "2024-01-15 14:15:18",
      level: "error",
      category: "API",
      message: "API rate limit exceeded",
      user: "api-client-123",
      ip: "203.0.113.45",
      details: "Rate limit of 1000 requests/hour exceeded",
    },
    {
      id: "7",
      timestamp: "2024-01-15 14:10:55",
      level: "success",
      category: "Checklist",
      message: "Checklist completed",
      user: "mike@heritageranch.com",
      details: "Livestock Health Checklist completed successfully",
    },
    {
      id: "8",
      timestamp: "2024-01-15 14:05:12",
      level: "warning",
      category: "Security",
      message: "Unusual access pattern detected",
      user: "admin@company.com",
      ip: "198.51.100.10",
      details: "Admin access from new geographic location",
    },
  ]

  const logStats = {
    total: systemLogs.length,
    errors: systemLogs.filter((log) => log.level === "error").length,
    warnings: systemLogs.filter((log) => log.level === "warning").length,
    info: systemLogs.filter((log) => log.level === "info").length,
    success: systemLogs.filter((log) => log.level === "success").length,
  }

  const getLogIcon = (level: string) => {
    switch (level) {
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getLogBadgeColor = (level: string) => {
    switch (level) {
      case "error":
        return "destructive"
      case "warning":
        return "secondary"
      case "success":
        return "default"
      default:
        return "outline"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Authentication":
        return <Shield className="h-4 w-4" />
      case "Payment":
        return <Zap className="h-4 w-4" />
      case "Database":
        return <Database className="h-4 w-4" />
      case "System":
        return <Server className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const filteredLogs = systemLogs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.user && log.user.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesLevel = levelFilter === "all" || log.level === levelFilter
    const matchesCategory = categoryFilter === "all" || log.category === categoryFilter
    const matchesTab = selectedTab === "all" || log.level === selectedTab

    return matchesSearch && matchesLevel && matchesCategory && matchesTab
  })

  const handleExportLogs = () => {
    console.log("Exporting system logs...")
  }

  const handleClearLogs = () => {
    console.log("Clearing old logs...")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>System Logs</DialogTitle>
        </DialogHeader>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-5 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Total</p>
                  <p className="text-2xl font-bold">{logStats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-sm font-medium">Errors</p>
                  <p className="text-2xl font-bold text-red-600">{logStats.errors}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">Warnings</p>
                  <p className="text-2xl font-bold text-yellow-600">{logStats.warnings}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Success</p>
                  <p className="text-2xl font-bold text-green-600">{logStats.success}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Info className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Info</p>
                  <p className="text-2xl font-bold text-blue-600">{logStats.info}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="success">Success</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Authentication">Authentication</SelectItem>
              <SelectItem value="Payment">Payment</SelectItem>
              <SelectItem value="System">System</SelectItem>
              <SelectItem value="Database">Database</SelectItem>
              <SelectItem value="API">API</SelectItem>
              <SelectItem value="Security">Security</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleExportLogs}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" onClick={handleClearLogs}>
              Clear Old
            </Button>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="all">All ({logStats.total})</TabsTrigger>
            <TabsTrigger value="error">Errors ({logStats.errors})</TabsTrigger>
            <TabsTrigger value="warning">Warnings ({logStats.warnings})</TabsTrigger>
            <TabsTrigger value="info">Info ({logStats.info})</TabsTrigger>
            <TabsTrigger value="success">Success ({logStats.success})</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-4">
            <div className="space-y-2">
              {filteredLogs.map((log) => (
                <Card key={log.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="flex items-center space-x-2 mt-1">
                          {getLogIcon(log.level)}
                          {getCategoryIcon(log.category)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{log.message}</span>
                            <Badge variant={getLogBadgeColor(log.level)} className="text-xs">
                              {log.level}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {log.category}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{log.timestamp}</span>
                            </div>
                            {log.user && (
                              <div className="flex items-center space-x-1">
                                <User className="h-3 w-3" />
                                <span>{log.user}</span>
                              </div>
                            )}
                            {log.ip && (
                              <div className="flex items-center space-x-1">
                                <Server className="h-3 w-3" />
                                <span>{log.ip}</span>
                              </div>
                            )}
                          </div>
                          {log.details && <p className="text-sm text-muted-foreground">{log.details}</p>}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredLogs.length === 0 && (
              <div className="text-center py-8">
                <Activity className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No logs found matching your criteria</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
