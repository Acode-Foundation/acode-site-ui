import { ArrowLeft, ArrowRight, CheckCircle, Mail, Lock, Eye, EyeOff } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

type Step = "email" | "otp" | "success";

export default function ForgotPassword() {
	const [currentStep, setCurrentStep] = useState<Step>("email");
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleSendOTP = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) return;

		setIsLoading(true);
		try {
			const response = await fetch(`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/otp?type=reset`, {
				method: "POST",
				body: JSON.stringify({ email }),
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (response.ok) {
				setCurrentStep("otp");
				toast({
					title: "OTP Sent",
					description: "Please check your email for the verification code.",
				});
			} else {
				// this Variable naming Isn't AI generated, I write them as I feel better. 🙃
				const responseBody = await response.json();
				toast({
					title: "Error",
					description: responseBody.error || "Failed to send OTP. Please try again.",
					variant: "destructive",
				});
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "Network error. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};


	const handleResetPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (otp.length !== 6) {
			toast({
				title: "Invalid OTP",
				description: "Please enter a valid 6-digit verification code.",
				variant: "destructive",
			});
			return;
		}

		if (password !== confirmPassword) {
			toast({
				title: "Password Mismatch",
				description: "Passwords do not match. Please try again.",
				variant: "destructive",
			});
			return;
		}

		if (password.length < 8) {
			toast({
				title: "Password Too Short",
				description: "Password must be at least 8 characters long.",
				variant: "destructive",
			});
			return;
		}

		setIsLoading(true);
		try {
			const response = await fetch(`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/password/reset`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, otp, password }),
			});

			if (response.ok) {
				setCurrentStep("success");
				toast({
					title: "Password Reset Successful",
					description: "Your password has been reset successfully.",
				});
			} else {
				const error = await response.json();
				// Check if it's an OTP validation error
				if (error.message && error.message.toLowerCase().includes("otp")) {
					toast({
						title: "Invalid OTP",
						description: "The verification code is invalid or expired. Please try again.",
						variant: "destructive",
					});
				} else {
					toast({
						title: "Reset Failed",
						description: error.message || "Failed to reset password. Please try again.",
						variant: "destructive",
					});
				}
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "Network error. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const getStepContent = () => {
		switch (currentStep) {
			case "email":
				return {
					title: "Forgot Password?",
					description: "No worries! Enter your email and we'll send you a verification code",
					icon: <Mail className="w-8 h-8 text-white" />,
					content: (
						<form onSubmit={handleSendOTP} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="email">Email Address</Label>
								<div className="relative">
									<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
									<Input
										id="email"
										type="email"
										placeholder="Enter your email address"
										title="Enter your Email Address"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
										className="pl-10 bg-background/50"
									/>
								</div>
							</div>

							<Button
								type="submit"
								disabled={isLoading}
								className="w-full bg-gradient-primary hover:shadow-glow-primary transition-all duration-300 group"
							>
								{isLoading ? "Sending..." : "Send OTP"}
								<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
							</Button>
						</form>
					),
				};

			case "otp":
				return {
					title: "Enter Verification Code & New Password",
					description: `We've sent a 6-digit code to ${email}. Enter the code and your new password below.`,
					icon: <Lock className="w-8 h-8 text-white" />,
					content: (
						<form onSubmit={handleResetPassword} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="otp">Verification Code</Label>
								<Input
									id="otp"
									type="text"
									placeholder="Enter 6-digit code"
									value={otp}
									onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
									required
									className="text-center text-lg tracking-widest bg-background/50"
									maxLength={6}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="password">New Password</Label>
								<div className="relative">
									<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
									<Input
										id="password"
										type={showPassword ? "text" : "password"}
										placeholder="Enter new password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										autoComplete="new-password"
										required
										className="pl-10 pr-10 bg-background/50"
									/>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
										onClick={() => setShowPassword(!showPassword)}
									>
										{showPassword ? (
											<EyeOff className="h-4 w-4" />
										) : (
											<Eye className="h-4 w-4" />
										)}
									</Button>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="confirmPassword">Confirm Password</Label>
								<div className="relative">
									<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
									<Input
										id="confirmPassword"
										className="pl-10 pr-10 bg-background/50"
										type={showConfirmPassword ? "text" : "password"}
										placeholder="Confirm new password"
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										autoComplete="new-password"
										required
									/>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									>
										{showConfirmPassword ? (
											<EyeOff className="h-4 w-4" />
										) : (
											<Eye className="h-4 w-4" />
										)}
									</Button>
								</div>
							</div>

							<Button
								type="submit"
								disabled={isLoading || otp.length !== 6}
								className="w-full bg-gradient-primary hover:shadow-glow-primary transition-all duration-300 group"
							>
								{isLoading ? "Resetting..." : "Reset Password"}
								<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
							</Button>

							<div className="text-center">
								<Button
									type="button"
									variant="ghost"
									onClick={() => setCurrentStep("email")}
									className="text-sm"
								>
									Change Email
								</Button>
							</div>
						</form>
					),
				};


			case "success":
				return {
					title: "Password Reset Successful!",
					description: "Your password has been reset successfully. You can now log in with your new password.",
					icon: <CheckCircle className="w-8 h-8 text-white" />,
					content: (
						<div className="space-y-4">
							<div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
								<CheckCircle className="w-8 h-8 text-green-500" />
							</div>
							<div className="text-center">
								<Link to="/login">
									<Button className="w-full bg-gradient-primary hover:shadow-glow-primary transition-all duration-300 group">
										Go to Login
										<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
									</Button>
								</Link>
							</div>
						</div>
					),
				};

			default:
				return null;
		}
	};

	const stepContent = getStepContent();
	if (!stepContent) return null;

	return (
		<div className="flex items-center justify-center py-8 px-4">
			<div className="w-full max-w-md">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
						{stepContent.icon}
					</div>
					<h1 className="text-3xl font-bold mb-2">{stepContent.title}</h1>
					<p className="text-muted-foreground">{stepContent.description}</p>
				</div>

				<Card className="bg-card/50 backdrop-blur-sm border-border">
					<CardContent className="pt-6">
						{stepContent.content}

						{currentStep !== "success" && (
							<div className="mt-6 text-center">
								<Link
									to="/login"
									className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									<ArrowLeft className="w-4 h-4 mr-1" />
									Back to Login
								</Link>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
