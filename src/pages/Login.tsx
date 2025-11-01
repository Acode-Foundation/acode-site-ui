import { Eye, EyeOff, Github, Lock, LogIn, Mail } from "lucide-react";
import { useState } from "react";
import { Link, redirect, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
	// States & Hooks.
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();
	const navigate = useNavigate();
	const params = useParams();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const formData = new FormData(e.target as HTMLFormElement);
			const response = await fetch(
				`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/login`,
				{
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

			if (responseData?.error || !response.ok) {
				setIsLoading(false);
				return toast({
					title: "Login Failed",
					description:
						`${responseData?.error}` ||
						`Something went wrong, server responded empty (request status code: ${response.status}). Please try again.`,
					// destructive = bg Red (shown as error)
					variant: "destructive",
				});
			}

			toast({
				title: "Login Success",
				description: "Successfully logged in, redirecting...",
			});

			setTimeout(() => {
				let redirectUrl = params?.redirect as string;
				setIsLoading(false);
				if (params.redirect === "app") {
					redirectUrl = `acode://user/login/${responseData.token}`;
				}

				navigate(`${redirectUrl || "/dashboard"}`);
			}, 1000);
		} catch (error) {
			console.error(`Login attempt Failed: `, error);
			setIsLoading(false);
			toast({
				title: "Login Failed",
				description: `Something went wrong, server responded empty/request/network error (as ${error.message || error}), Please try again.`,
				// destructive = bg Red (shown as error)
				variant: "destructive",
			});
			return;
		}
	};

	const handleSocialLogin = (provider: string) => {
		toast({
			title: `${provider} login`,
			description: "Social login functionality coming soon!",
		});
	};

	return (
		<div className="flex items-center justify-center py-8 px-4">
			<div className="w-full max-w-md">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
						<LogIn className="w-8 h-8 text-white" />
					</div>
					<h1 className="text-3xl font-bold mb-2">Welcome back</h1>
					<p className="text-muted-foreground">Sign in to your Acode account</p>
				</div>

				<Card className="bg-card/50 backdrop-blur-sm border-border">
					<CardHeader className="space-y-1 pb-4">
						<div className="space-y-2">
							<Button
								variant="outline"
								className="w-full disabled aria-disabled"
								onClick={() => handleSocialLogin("GitHub")}
							>
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
						<form onSubmit={handleLogin} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									name="email"
									placeholder="Enter your email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									className="bg-background/50"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<div className="relative">
									<Input
										id="password"
										type={showPassword ? "text" : "password"}
										name="password"
										placeholder="Enter your password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										className="bg-background/50 pr-10"
									/>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
										onClick={() => setShowPassword(!showPassword)}
									>
										{showPassword ? (
											<EyeOff className="h-4 w-4 text-muted-foreground" />
										) : (
											<Eye className="h-4 w-4 text-muted-foreground" />
										)}
									</Button>
								</div>
							</div>

							<div className="flex items-center justify-between">
								<Link
									to="/forgot-password"
									className="text-sm text-primary hover:underline"
								>
									Forgot password?
								</Link>
							</div>

							<Button
								type="submit"
								className="w-full bg-gradient-primary hover:shadow-glow-primary transition-all duration-300"
								disabled={isLoading}
							>
								{isLoading ? (
									<div className="flex items-center">
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
										Signing in...
									</div>
								) : (
									<>
										<Lock className="w-4 h-4 mr-2" />
										Sign In
									</>
								)}
							</Button>
						</form>

						<div className="mt-6 text-center text-sm">
							<span className="text-muted-foreground">
								Don't have an account?{" "}
							</span>
							<Link to="/register" className="text-primary hover:underline">
								Sign up
							</Link>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
