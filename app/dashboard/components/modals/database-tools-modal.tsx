"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Database,
  HardDrive,
  Activity,
  Download,
  Upload,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle,
  Zap,
  BarChart3,
  Settings,
  Search,
  Trash2,
} from "lucide-react"
import { useState } from "react"

interface DatabaseToolsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DatabaseToolsModal({ isOpen, onClose }: DatabaseToolsModalProps) {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [sqlQuery, setSqlQuery] = useState("")
  const [backupInProgress, setBackupInProgress] = useState(false)
  const [optimizationInProgress, setOptimizationInProgress] = useState(false)

  const databaseStats = {
    totalSize: "15.7 GB",
    tables: 47,
    records: "2.3M",
    connections: 23,
    uptime: "99.9%",
    avgResponseTime: "145ms",
    storageUsed: 67,
    memoryUsage: 45,
    cpuUsage: 23,
  }

  const recentBackups = [
    {
      id: 1,
      date: "2024-01-15 02:00:00",
      size: "15.2 GB",
      duration: "23 minutes",
      status: "success",
      type: "Scheduled",
    },
    {
      id: 2,
      date: "2024-01-14 02:00:00",
      size: "15.0 GB",
      duration: "22 minutes",
      status: "success",
      type: "Scheduled",
    },
    {
      id: 3,
      date: "2024-01-13 14:30:00",
      size: "14.8 GB",
      duration: "25 minutes",
      status: "success",
      type: "Manual",
    },
    {
      id: 4,
      date: "2024-01-13 02:00:00",
      size: "14.8 GB",
      duration: "Failed",
      status: "failed",
      type: "Scheduled",
    },
  ]

  const tableStats = [
    { name: "users", records: "1,247", size: "2.3 GB", lastUpdated: "2 minutes ago" },
    { name: "companies", records: "47", size: "156 MB", lastUpdated: "5 minutes ago" },
    { name: "checklists", records: "892", size: "1.8 GB", lastUpdated: "1 minute ago" },
    { name: "tasks", records: "15,634", size: "4.2 GB", lastUpdated: "30 seconds ago" },
    { name: "guidelines", records: "234", size: "3.1 GB", lastUpdated: "10 minutes ago" },
    { name: "chat_messages", records: "45,892", size: "2.8 GB", lastUpdated: "5 seconds ago" },
    { name: "audit_logs", records: "123,456", size: "1.3 GB", lastUpdated: "1 minute ago" },
  ]

  const handleBackupDatabase = () => {
    setBackupInProgress(true)
    console.log("Starting database backup...")
    // Simulate backup process
    setTimeout(() => {
      setBackupInProgress(false)
      console.log("Backup completed")
    }, 3000)
  }

  const handleOptimizeDatabase = () => {
    setOptimizationInProgress(true)
    console.log("Starting database optimization...")
    // Simulate optimization process
    setTimeout(() => {
      setOptimizationInProgress(false)
      console.log("Optimization completed")
    }, 5000)
  }

  const handleExecuteQuery = () => {
    console.log("Executing query:", sqlQuery)
  }

  const handleRestoreBackup = (backupId: number) => {
    console.log("Restoring backup:", backupId)
  }

  const handleDeleteBackup = (backupId: number) => {
    console.log("Deleting backup:", backupId)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Database Management Tools</DialogTitle>
        </DialogHeader>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
            <TabsTrigger value="query">Query Console</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Database Stats */}
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Database Size</CardTitle>
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{databaseStats.totalSize}</div>
                  <p className="text-xs text-muted-foreground">Total storage used</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tables</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{databaseStats.tables}</div>
                  <p className="text-xs text-muted-foreground">Active tables</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Records</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{databaseStats.records}</div>
                  <p className="text-xs text-muted-foreground">Total records</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Connections</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{databaseStats.connections}</div>
                  <p className="text-xs text-muted-foreground">Active connections</p>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Storage Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Used</span>
                      <span>{databaseStats.storageUsed}%</span>
                    </div>
                    <Progress value={databaseStats.storageUsed} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Memory Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Used</span>
                      <span>{databaseStats.memoryUsage}%</span>
                    </div>
                    <Progress value={databaseStats.memoryUsage} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">CPU Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Used</span>
                      <span>{databaseStats.cpuUsage}%</span>
                    </div>
                    <Progress value={databaseStats.cpuUsage} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Table Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Table Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tableStats.map((table, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Database className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{table.name}</p>
                          <p className="text-sm text-muted-foreground">{table.records} records</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{table.size}</p>
                        <p className="text-sm text-muted-foreground">Updated {table.lastUpdated}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backup" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Create Backup</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Backup Type</Label>
                    <Select defaultValue="full">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full">Full Backup</SelectItem>
                        <SelectItem value="incremental">Incremental</SelectItem>
                        <SelectItem value="differential">Differential</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Compression</Label>
                    <Select defaultValue="gzip">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="gzip">GZIP</SelectItem>
                        <SelectItem value="lz4">LZ4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleBackupDatabase} disabled={backupInProgress} className="w-full">
                    {backupInProgress ? (
                      <>
                        <Pause className="mr-2 h-4 w-4" />
                        Creating Backup...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Create Backup
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Backup Schedule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input type="time" defaultValue="02:00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Retention (days)</Label>
                    <Input type="number" defaultValue="30" />
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Settings className="mr-2 h-4 w-4" />
                    Update Schedule
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Backups */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Backups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBackups.map((backup) => (
                    <div key={backup.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-full ${backup.status === "success" ? "bg-green-100" : "bg-red-100"}`}
                        >
                          {backup.status === "success" ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{backup.date}</p>
                          <p className="text-sm text-muted-foreground">
                            {backup.size} • {backup.duration} • {backup.type}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {backup.status === "success" && (
                          <Button size="sm" variant="outline" onClick={() => handleRestoreBackup(backup.id)}>
                            <Upload className="mr-1 h-3 w-3" />
                            Restore
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => handleDeleteBackup(backup.id)}>
                          <Trash2 className="mr-1 h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="query" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>SQL Query Console</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>SQL Query</Label>
                  <Textarea
                    placeholder="Enter your SQL query here..."
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    rows={8}
                    className="font-mono"
                  />
                </div>
                <div className="flex justify-between">
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => setSqlQuery("SELECT * FROM users LIMIT 10;")}>
                      Sample Query
                    </Button>
                    <Button variant="outline" onClick={() => setSqlQuery("")}>
                      Clear
                    </Button>
                  </div>
                  <Button onClick={handleExecuteQuery} disabled={!sqlQuery.trim()}>
                    <Play className="mr-2 h-4 w-4" />
                    Execute Query
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Query Results */}
            <Card>
              <CardHeader>
                <CardTitle>Query Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="mx-auto h-12 w-12 mb-4" />
                  <p>Execute a query to see results here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Database Optimization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Rebuild Indexes</p>
                        <p className="text-sm text-muted-foreground">
                          Optimize database indexes for better performance
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Zap className="mr-1 h-3 w-3" />
                        Run
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Analyze Tables</p>
                        <p className="text-sm text-muted-foreground">Update table statistics for query optimization</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <BarChart3 className="mr-1 h-3 w-3" />
                        Analyze
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Clean Up Logs</p>
                        <p className="text-sm text-muted-foreground">Remove old log entries to free up space</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Trash2 className="mr-1 h-3 w-3" />
                        Clean
                      </Button>
                    </div>
                  </div>
                  <Button onClick={handleOptimizeDatabase} disabled={optimizationInProgress} className="w-full">
                    {optimizationInProgress ? (
                      <>
                        <Pause className="mr-2 h-4 w-4" />
                        Optimizing...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Run Full Optimization
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Maintenance Schedule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Optimization Frequency</Label>
                    <Select defaultValue="weekly">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Maintenance Window</Label>
                    <Select defaultValue="03:00">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="01:00">01:00 - 02:00</SelectItem>
                        <SelectItem value="02:00">02:00 - 03:00</SelectItem>
                        <SelectItem value="03:00">03:00 - 04:00</SelectItem>
                        <SelectItem value="04:00">04:00 - 05:00</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Settings className="mr-2 h-4 w-4" />
                    Update Schedule
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Real-time Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Query Response Time</span>
                      <Badge variant="outline">{databaseStats.avgResponseTime}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Active Connections</span>
                      <Badge variant="outline">{databaseStats.connections}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Uptime</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {databaseStats.uptime}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Queries/Second</span>
                      <Badge variant="outline">847</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Alerts & Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">High Memory Usage</p>
                        <p className="text-xs text-muted-foreground">Memory usage at 85%</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Backup Completed</p>
                        <p className="text-xs text-muted-foreground">Daily backup successful</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
