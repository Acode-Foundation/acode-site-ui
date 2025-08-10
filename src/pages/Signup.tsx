import { ArrowRight, Eye, EyeOff, Github, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function Signup() {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	return (
		<div className="flex items-center justify-center py-8 px-4">
			<div className="w-full max-w-md">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
						<User className="w-8 h-8 text-white" />
					</div>
					<h1 className="text-3xl font-bold mb-2">Create Account</h1>
					<p className="text-muted-foreground">
						Join the Acode community and start building amazing things
					</p>
				</div>

				<Card className="bg-card/50 backdrop-blur-sm border-border">
					<CardHeader className="space-y-1 pb-4">
						<div className="space-y-2">
							<Button variant="outline" className="w-full">
								<Github className="w-4 h-4 mr-2" />
								Continue with GitHub
							</Button>
						</div>

						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<Separator />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-card px-2 text-muted-foreground">
									Or continue with
								</span>
							</div>
						</div>
					</CardHeader>

					<CardContent>
						<form className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="firstName">First Name</Label>
									<Input
										id="firstName"
										placeholder="John"
										required
										className="bg-background/50"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="lastName">Last Name</Label>
									<Input
										id="lastName"
										placeholder="Doe"
										required
										className="bg-background/50"
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="username">Username</Label>
								<div className="relative">
									<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
									<Input
										id="username"
										placeholder="johndoe"
										required
										className="pl-10 bg-background/50"
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<div className="relative">
									<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
									<Input
										id="email"
										type="email"
										placeholder="john@example.com"
										required
										className="pl-10 bg-background/50"
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<div className="relative">
									<Input
										id="password"
										type={showPassword ? "text" : "password"}
										placeholder="Create a strong password"
										required
										className="pr-10 bg-background/50"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
									>
										{showPassword ? (
											<EyeOff className="h-4 w-4" />
										) : (
											<Eye className="h-4 w-4" />
										)}
									</button>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="confirmPassword">Confirm Password</Label>
								<div className="relative">
									<Input
										id="confirmPassword"
										type={showConfirmPassword ? "text" : "password"}
										placeholder="Confirm your password"
										required
										className="pr-10 bg-background/50"
									/>
									<button
										type="button"
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
									>
										{showConfirmPassword ? (
											<EyeOff className="h-4 w-4" />
										) : (
											<Eye className="h-4 w-4" />
										)}
									</button>
								</div>
							</div>

							<div className="flex items-center space-x-2">
								<Checkbox id="terms" />
								<Label htmlFor="terms" className="text-sm">
									I agree to the{" "}
									<Link to="/terms" className="text-primary hover:underline">
										Terms of Service
									</Link>{" "}
									and{" "}
									<Link to="/privacy" className="text-primary hover:underline">
										Privacy Policy
									</Link>
								</Label>
							</div>

							<Button
								type="submit"
								className="w-full bg-gradient-primary hover:shadow-glow-primary transition-all duration-300 group"
							>
								Create Account
								<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
							</Button>
						</form>

						<div className="mt-6 text-center text-sm">
							<span className="text-muted-foreground">
								Already have an account?{" "}
							</span>
							<Link to="/login" className="text-primary hover:underline">
								Sign in
							</Link>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
