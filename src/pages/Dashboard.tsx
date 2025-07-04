import { useState } from "react"
import { Link } from "react-router-dom"
import { Plus, Upload, Edit, Trash2, Eye, Users, Settings, BarChart3, Shield, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Mock user data
const currentUser = {
  name: "John Doe",
  email: "john@example.com",
  role: "user", // "user" or "admin"
  avatar: "JD",
  joinDate: "2024-01-15"
}

// Mock plugin data
const userPlugins = [
  {
    id: "1",
    name: "My Theme Studio",
    status: "approved",
    downloads: 1234,
    rating: 4.5,
    revenue: 89.99
  },
  {
    id: "2", 
    name: "Code Formatter Pro",
    status: "pending",
    downloads: 0,
    rating: 0,
    revenue: 0
  }
]

const allPlugins = [
  ...userPlugins,
  {
    id: "3",
    name: "Git Manager",
    author: "deadlyjack",
    status: "approved",
    downloads: 50234,
    rating: 4.8
  },
  {
    id: "4",
    name: "AI Assistant",
    author: "acode-dev",
    status: "pending",
    downloads: 0,
    rating: 0
  }
]

const allUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    plugins: 2,
    joinDate: "2024-01-15"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com", 
    role: "developer",
    plugins: 5,
    joinDate: "2023-12-01"
  }
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const isAdmin = currentUser.role === "admin"

  const UserDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Plugins</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userPlugins.length}</div>
            <p className="text-xs text-muted-foreground">
              {userPlugins.filter(p => p.status === "approved").length} approved
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userPlugins.reduce((sum, p) => sum + p.downloads, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all plugins
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${userPlugins.reduce((sum, p) => sum + p.revenue, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-gradient-primary hover:shadow-glow-primary">
              <Plus className="w-4 h-4 mr-2" />
              Submit New Plugin
            </Button>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Upload Update
            </Button>
            <Button variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* My Plugins */}
      <Card>
        <CardHeader>
          <CardTitle>My Plugins</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userPlugins.map((plugin) => (
              <div key={plugin.id} className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold">
                    {plugin.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{plugin.name}</h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant={plugin.status === "approved" ? "default" : "secondary"}>
                        {plugin.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {plugin.downloads.toLocaleString()} downloads
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const AdminDashboard = () => (
    <div className="space-y-6">
      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Plugins</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allPlugins.length}</div>
            <p className="text-xs text-muted-foreground">
              {allPlugins.filter(p => p.status === "approved").length} approved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allUsers.length}</div>
            <p className="text-xs text-muted-foreground">
              Active developers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allPlugins.filter(p => p.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Need approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,450</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plugin Management */}
        <Card>
          <CardHeader>
            <CardTitle>Plugin Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allPlugins.map((plugin) => (
                <div key={plugin.id} className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{plugin.name}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant={plugin.status === "approved" ? "default" : "secondary"}>
                        {plugin.status}
                      </Badge>
                      {"author" in plugin && (
                        <span className="text-sm text-muted-foreground">by {plugin.author}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button variant="outline" size="sm">
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{user.name}</h4>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <Badge variant="outline">{user.role}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button variant="outline" size="sm">
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {currentUser.name}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback>{currentUser.avatar}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{currentUser.name}</p>
                <Badge variant="outline">{currentUser.role}</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {isAdmin && <TabsTrigger value="admin">Admin Panel</TabsTrigger>}
            {!isAdmin && <TabsTrigger value="plugins">My Plugins</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 mt-6">
            {isAdmin ? <AdminDashboard /> : <UserDashboard />}
          </TabsContent>
          
          {isAdmin && (
            <TabsContent value="admin" className="space-y-6 mt-6">
              <AdminDashboard />
            </TabsContent>
          )}
          
          {!isAdmin && (
            <TabsContent value="plugins" className="space-y-6 mt-6">
              <UserDashboard />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}