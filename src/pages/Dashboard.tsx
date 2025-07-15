import { useState } from "react"
import { Link } from "react-router-dom"
import { Plus, Upload, Edit, Trash2, Eye, Users, Settings, BarChart3, Shield, DollarSign, LogOut, Star, Wallet, CreditCard, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

// Mock user data
const currentUser = {
  name: "John Doe",
  email: "john@example.com", 
  role: "user", // "user" or "admin"
  avatar: "JD",
  joinDate: "2024-01-15",
  bio: "Full-stack developer passionate about mobile development and creating tools that enhance productivity.",
  website: "https://johndoe.dev",
  github: "https://github.com/johndoe",
  location: "San Francisco, CA",
  totalEarnings: 245.67,
  bankAccount: {
    accountHolder: "John Doe",
    bankName: "Chase Bank",
    accountNumber: "****1234",
    routingNumber: "****567"
  }
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

  const ProfileManagement = () => (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Profile Information
            </CardTitle>
            <Button variant="destructive" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-6">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="text-2xl">{currentUser.avatar}</AvatarFallback>
            </Avatar>
            <Button variant="outline">Change Avatar</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={currentUser.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={currentUser.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" defaultValue={currentUser.website} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github">GitHub</Label>
              <Input id="github" defaultValue={currentUser.github} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" defaultValue={currentUser.location} />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" defaultValue={currentUser.bio} rows={3} />
          </div>
          
          <Button className="bg-gradient-primary">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Bank Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Bank Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accountHolder">Account Holder</Label>
              <Input id="accountHolder" defaultValue={currentUser.bankAccount.accountHolder} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input id="bankName" defaultValue={currentUser.bankAccount.bankName} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input id="accountNumber" defaultValue={currentUser.bankAccount.accountNumber} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="routingNumber">Routing Number</Label>
              <Input id="routingNumber" defaultValue={currentUser.bankAccount.routingNumber} />
            </div>
          </div>
          <Button variant="outline">Update Bank Details</Button>
        </CardContent>
      </Card>

      {/* Reviews & Ratings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Recent Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { plugin: "My Theme Studio", rating: 5, review: "Amazing theme! Love the customization options.", user: "DevUser123" },
              { plugin: "Code Formatter Pro", rating: 4, review: "Great tool, saves me a lot of time.", user: "CodeMaster" }
            ].map((review, index) => (
              <div key={index} className="p-4 border border-border/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{review.plugin}</h4>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">"{review.review}"</p>
                <p className="text-xs text-muted-foreground">- {review.user}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const EarningsOverview = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentUser.totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Available for withdrawal</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$89.99</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payment</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$156.78</div>
            <p className="text-xs text-muted-foreground">Next payment: Feb 15</p>
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
            <Link to="/earnings">
              <Button className="bg-gradient-primary">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Detailed Earnings
              </Button>
            </Link>
            <Button variant="outline">
              <CreditCard className="w-4 h-4 mr-2" />
              Request Payout
            </Button>
            <Button variant="outline">
              <Building2 className="w-4 h-4 mr-2" />
              Update Bank Details
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { date: "2024-01-28", amount: 2.99, plugin: "Git Manager", type: "Sale" },
              { date: "2024-01-27", amount: 1.99, plugin: "Code Formatter Pro", type: "Sale" },
              { date: "2024-01-26", amount: 4.99, plugin: "My Theme Studio", type: "Sale" }
            ].map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                <div>
                  <h4 className="font-medium">{transaction.plugin}</h4>
                  <p className="text-sm text-muted-foreground">{transaction.type} • {transaction.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-primary">+${transaction.amount.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            {isAdmin && <TabsTrigger value="admin">Admin Panel</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 mt-6">
            {isAdmin ? <AdminDashboard /> : <UserDashboard />}
          </TabsContent>
          
          {isAdmin && (
            <TabsContent value="admin" className="space-y-6 mt-6">
              <AdminDashboard />
            </TabsContent>
          )}
          
          <TabsContent value="profile" className="space-y-6 mt-6">
            <ProfileManagement />
          </TabsContent>
          
          <TabsContent value="earnings" className="space-y-6 mt-6">
            <EarningsOverview />
          </TabsContent>
        </Tabs>
      </div>
  )
}