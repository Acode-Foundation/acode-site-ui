// TODO: Replace GITHUB from lucide-react to simple icons; or with it's own svg. Ref: https://github.com/lucide-icons/lucide/issues/670
import { ArrowRight, Eye, EyeOff, Github, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link, redirect, useNavigate, useParams } from "react-router-dom";
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
import { toast } from "@/hooks/use-toast";

export default function Signup() {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [otpSent, setOtpSent] = useState(false);
	const [otp, setOtp] = useState("");
	const [isOtpLoading, setIsOtpLoading] = useState(false);
	const params = useParams();
	const navigate = useNavigate()

	const handleSendOtp = async () => {
		const emailInput = document.getElementById("email") as HTMLInputElement;
		const email = emailInput?.value;
		
		if (!email) {
			toast({
				description: "Please enter your email first",
			});
			return;
		}

		setIsOtpLoading(true);
		try {
			const response = await fetch(
				`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/otp`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email }),
					credentials: "include",
				}
			);

			if (response.ok) {
				setOtpSent(true);
				// alert("OTP sent to your email!");
				toast({
					description: "OTP sent to your email!",
					duration: 2000
				})
			} else {
				toast({
					title: "Failed to send OTP.",
					description: `Something went wrong, server responded empty (request status code: ${response.status}). Please try again.`, 
					variant: "destructive"
				});
			}
		} catch (error) {
			console.error("Error sending OTP:", error);

			toast({
				title: "Failed to send OTP. Please try again.",
				description: `Something went wrong, server has responded empty/request/network error (as ${error.message || error}), Please try again.`,
				// destructive = bg Red (shown as error)
				variant: "destructive",
			});
		} finally {
			setIsOtpLoading(false);
		}
	};

	const handleSignup = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!otpSent || !otp) {
			toast({
				description: "Please verify your email with OTP first",
				// destructive = bg Red (shown as error)
				variant: "destructive"
			})
			return;
		}

		const formData = new FormData(e.target as HTMLFormElement);

		console.log("Signup FormData", formData,
			formData.get("email"),
			formData.get("password").toString(),
			formData.get("confirmPassword").toString(),
			formData.get("otp"),
			(formData.get("password").toString().localeCompare(formData.get("confirmPassword").toString()))
		);

		if(formData.get("password") !== formData.get("confirmPassword")) {

			toast({
				description: "Password & Confirm Password both Must be the same.",
				variant: "destructive",
			})
			return;
		}

		try {

			console.log("Signup env", import.meta.env);

			const response = await fetch(
				`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/user`, {
					method: "POST",
					body: formData,
					credentials: "include",
				},
			);

			const responseData = response.headers
				.get("content-type")
				.includes("application/json")
				? await response.json()
				: null;

			if (response.ok) {
				toast({
					title: "Account Created Successfully",
					description: `Redirecting ${params.redirect ? `to ${params.redirect}` : ""}....`,
					lang: "en-US"
				});

				setTimeout(() => {					
					// window.location.href = `/login${params?.redirect ? `?redirect=${params?.redirect}` : ""}`
					navigate(`/login${params?.redirect ? `?redirect=${params?.redirect}` : ""}`)
				}, 2000)
			} else {
				toast({
					title: "Failed to create account.",
					description:
						`${responseData?.error}` ||
						`Something went wrong, server responded empty (request status code: ${response.status}). Please try again.`,
					// destructive = bg Red (shown as error)
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("Error while creating account:", error);
			// alert("Failed to create account. Please try again.");

			toast({
				title: "Failed to create account.",
				description: `Something went wrong, server responded empty/request/network error (as ${error.message || error}), Please try again.`,
				// destructive = bg Red (shown as error)
				variant: "destructive",
			});
		}
	}

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
							<Button variant="outline" className="w-full" disabled aria-disabled>
								<Github className="w-4 h-4 mr-2" />
								Continue with GitHub (Soon)
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
						<form className="space-y-4" onSubmit={handleSignup}>

							<div className="space-y-2">
								<Label htmlFor="username">Username</Label>
								<div className="relative">
									<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
									<Input
										id="username"
										name="name"
										placeholder="johndoe"
										autoComplete="username"
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
										name="email"
										placeholder="john@example.com"
										required
										className="pl-10 bg-background/50"
									/>
								</div>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={handleSendOtp}
									disabled={isOtpLoading}
									title="Press it, After entering your Email Above"
									className="w-full border-slate-700 hover:border-none"
								>
									{isOtpLoading ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}
								</Button>
							</div>

							{otpSent && (
								<div className="space-y-2">
									<Label htmlFor="otp">Enter OTP</Label>
									<Input
										id="otp"
										type="text"
										placeholder="Enter 6-digit OTP"
										name="otp"
										value={otp}
										onChange={(e) => setOtp(e.target.value)}
										required
										maxLength={6}
										className="bg-background/50 text-center text-lg tracking-widest"
									/>
								</div>
							)}

							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<div className="relative">
									<Input
										id="password"
										name="password"
										type={showPassword ? "text" : "password"}
										placeholder="Create a strong password"
										autoComplete="new-password"
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
										name="confirmPassword"
										type={showConfirmPassword ? "text" : "password"}
										placeholder="Confirm your password"
										autoComplete="new-password"
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
								<Checkbox id="terms" aria-required={true} required={true}/>
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
