import { useState } from "react"
import { Link } from "react-router-dom"
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ForgotPassword() {
  const [emailSent, setEmailSent] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate email sending
    setEmailSent(true)
  }

  return (
    <div className="flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {!emailSent ? "Forgot Password?" : "Check Your Email"}
          </h1>
          <p className="text-muted-foreground">
            {!emailSent ? "No worries! Enter your email and we'll send you a reset link" : `We've sent a password reset link to ${email}`}
          </p>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader className="space-y-1 pb-4">
            {emailSent && (
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            )}
          </CardHeader>
          
          <CardContent>
            {!emailSent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="Enter your email address" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                        className="pl-10 bg-background/50"
                      />
                    </div>
                  </div>
                  
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-primary hover:shadow-glow-primary transition-all duration-300 group"
                >
                  Send Reset Link
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                </div>

                <Button 
                  onClick={() => setEmailSent(false)}
                  variant="outline" 
                  className="w-full"
                >
                  Resend Email
                </Button>
              </div>
            )}

            <div className="mt-6 text-center">
              <Link 
                to="/login" 
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}