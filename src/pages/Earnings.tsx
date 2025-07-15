import { useState } from "react"
import { ArrowLeft, DollarSign, TrendingUp, Clock, CreditCard, Download, Calendar } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Mock earnings data
const earningsData = {
  unpaidEarnings: 245.67,
  totalEarnings: 2450.89,
  paymentThreshold: 100,
  nextPaymentDate: "2024-02-15",
  totalPluginsSold: 1248,
  averagePrice: 1.96
}

// Mock payment history
const paymentHistory = [
  {
    id: "1",
    date: "2024-01-15",
    amount: 189.45,
    status: "paid",
    method: "Bank Transfer",
    plugins: ["Console Pro", "Git Manager", "Theme Studio"],
    transactionId: "TXN_2024_001"
  },
  {
    id: "2", 
    date: "2023-12-15",
    amount: 234.78,
    status: "paid",
    method: "PayPal",
    plugins: ["Console Pro", "Code Formatter"],
    transactionId: "TXN_2023_025"
  },
  {
    id: "3",
    date: "2023-11-15", 
    amount: 156.23,
    status: "paid",
    method: "Bank Transfer",
    plugins: ["Git Manager", "Theme Studio"],
    transactionId: "TXN_2023_019"
  },
  {
    id: "4",
    date: "2023-10-15",
    amount: 98.45,
    status: "failed",
    method: "Bank Transfer",
    plugins: ["Console Pro"],
    transactionId: "TXN_2023_012"
  }
]

// Mock monthly earnings
const monthlyEarnings = {
  "2024": [
    { month: "January", earnings: 189.45, sales: 96 },
    { month: "February", earnings: 245.67, sales: 125 },
  ],
  "2023": [
    { month: "January", earnings: 145.23, sales: 74 },
    { month: "February", earnings: 167.89, sales: 85 },
    { month: "March", earnings: 178.45, sales: 91 },
    { month: "April", earnings: 156.78, sales: 80 },
    { month: "May", earnings: 189.34, sales: 97 },
    { month: "June", earnings: 201.56, sales: 103 },
    { month: "July", earnings: 198.67, sales: 101 },
    { month: "August", earnings: 234.89, sales: 120 },
    { month: "September", earnings: 189.45, sales: 97 },
    { month: "October", earnings: 98.45, sales: 50 },
    { month: "November", earnings: 156.23, sales: 80 },
    { month: "December", earnings: 234.78, sales: 120 }
  ]
}

export default function Earnings() {
  const [selectedYear, setSelectedYear] = useState("2024")
  const [selectedPeriod, setSelectedPeriod] = useState("all")

  const currentYearEarnings = monthlyEarnings[selectedYear as keyof typeof monthlyEarnings] || []

  const filteredPayments = paymentHistory.filter(payment => {
    if (selectedPeriod === "all") return true
    const paymentYear = new Date(payment.date).getFullYear().toString()
    return paymentYear === selectedPeriod
  })

  return (
    <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Earnings Overview</h1>
              <p className="text-muted-foreground">Track your plugin sales and payments</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unpaid Earnings</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                ${earningsData.unpaidEarnings.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Next payment: {new Date(earningsData.nextPaymentDate).toLocaleDateString()}
              </p>
              <div className="mt-2">
                <div className="text-xs text-muted-foreground mb-1">
                  Payment threshold: ${earningsData.paymentThreshold}
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.min((earningsData.unpaidEarnings / earningsData.paymentThreshold) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${earningsData.totalEarnings.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                From {earningsData.totalPluginsSold} plugin sales
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Sale Price</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${earningsData.averagePrice.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Per plugin sale
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Earnings */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Monthly Earnings
              </CardTitle>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentYearEarnings.map((monthData, index) => (
                <Card key={index} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      {monthData.month}
                    </div>
                    <div className="text-xl font-bold">
                      ${monthData.earnings.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {monthData.sales} sales
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment History
              </CardTitle>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Plugins</TableHead>
                  <TableHead>Transaction ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {new Date(payment.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">
                      ${payment.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={payment.status === "paid" ? "default" : payment.status === "failed" ? "destructive" : "secondary"}
                      >
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {payment.plugins.join(", ")}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {payment.transactionId}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredPayments.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No payments found for the selected period.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
  )
}