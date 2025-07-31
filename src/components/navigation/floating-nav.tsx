import {
	DollarSign,
	LogOut,
	Menu,
	Moon,
	Shield,
	Sun,
	User,
	UserCircle,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import acodeLogoSvg from "@/assets/acode-logo.svg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/ui/theme-provider";
import { useToast } from "@/hooks/use-toast";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { cn } from "@/lib/utils";

const baseNavItems = [
	{ name: "FAQ", href: "/faq", external: false },
	{ name: "Plugins", href: "/plugins", external: false },
	{ name: "Docs", href: "https://docs.acode.app", external: true },
];

const authNavItems = [
	{ name: "Login", href: "/login", external: false },
	{ name: "Signup", href: "/signup", external: false },
];

export function FloatingNav() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const { theme, setTheme } = useTheme();
	const location = useLocation();
	const navigate = useNavigate();
	const { toast } = useToast();
	const { data: user, isLoading, error } = useLoggedInUser();

	const isLoggedIn = !isLoading && !error && user;

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const handleLogout = async () => {
		try {
			const response = await fetch(
				`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/login`,
				{
					method: "DELETE",
					credentials: "include",
				},
			);

			if (response.ok) {
				toast({
					title: "Logged out successfully",
					description: "You have been logged out.",
				});
				navigate("/");
				window.location.reload(); // Refresh to clear user data
			} else {
				throw new Error("Logout failed");
			}
		} catch (error) {
			toast({
				title: "Logout failed",
				description: "Please try again.",
				variant: "destructive",
			});
		}
	};

	const navItems = isLoggedIn
		? baseNavItems
		: [...baseNavItems, ...authNavItems];

	return (
		<nav
			className={cn(
				"fixed top-1 left-4 right-4 lg:left-1/2 lg:right-auto lg:transform lg:-translate-x-1/2 z-50 transition-all duration-300 lg:max-w-7xl lg:w-auto",
				isScrolled
					? "bg-card/95 backdrop-blur-md border border-border/50 shadow-md"
					: "bg-card/60 backdrop-blur-md border border-border/30",
			)}
			style={{
				borderRadius: "1rem",
				padding: "0.75rem 1.5rem",
			}}
		>
			<div className="flex items-center justify-between w-full max-w-7xl mx-auto">
				{/* Logo */}
				<Link to="/" className="flex items-center space-x-3 group">
					<img
						src={acodeLogoSvg}
						alt="Acode"
						className="h-10 w-10 transition-transform duration-300 group-hover:scale-110"
					/>
					<span className="font-bold text-2xl bg-gradient-primary bg-clip-text text-transparent">
						Acode
					</span>
				</Link>

				{/* Desktop Navigation */}
				<div className="hidden lg:flex items-center space-x-1">
					<div className="flex items-center space-x-1">
						{navItems.map((item) => (
							<div key={item.name}>
								{item.external ? (
									<a
										href={item.href}
										target="_blank"
										rel="noopener noreferrer"
										className={cn(
											"text-sm font-medium transition-all duration-200 hover:text-primary px-3 py-2 relative",
											"before:absolute before:bottom-1 before:left-1/2 before:w-0 before:h-0.5 before:bg-primary before:transition-all before:duration-200",
											"hover:before:w-6 hover:before:-translate-x-1/2",
										)}
									>
										{item.name}
									</a>
								) : (
									<Link
										to={item.href}
										className={cn(
											"text-sm font-medium transition-all duration-200 hover:text-primary px-3 py-2 relative",
											"before:absolute before:bottom-1 before:left-1/2 before:w-0 before:h-0.5 before:bg-primary before:transition-all before:duration-200",
											location.pathname === item.href
												? "text-primary before:w-6 before:-translate-x-1/2"
												: "hover:before:w-6 hover:before:-translate-x-1/2",
										)}
									>
										{item.name}
									</Link>
								)}
							</div>
						))}
					</div>

					{/* User Menu or Theme Toggle */}
					{isLoggedIn ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="flex items-center space-x-2 h-9 px-3 hover:bg-primary/10 transition-colors duration-200 rounded-lg"
								>
									<Avatar className="h-6 w-6">
										{user?.github && (
											<AvatarImage
												src={`https://github.com/${user.github}.png`}
												alt={`${user.name}'s avatar`}
											/>
										)}
										<AvatarFallback className="text-xs bg-primary/10 text-primary">
											{user?.name?.[0]?.toUpperCase() || "U"}
										</AvatarFallback>
									</Avatar>
									<span className="text-sm font-medium">
										{user?.name || "User"}
									</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-48">
								<DropdownMenuItem asChild>
									<Link
										to="/dashboard"
										className="flex items-center cursor-pointer"
									>
										<User className="h-4 w-4 mr-2" />
										Dashboard
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link
										to={`/developer/${user?.email}`}
										className="flex items-center cursor-pointer"
									>
										<UserCircle className="h-4 w-4 mr-2" />
										Profile
									</Link>
								</DropdownMenuItem>
								{user?.role === "admin" && (
									<DropdownMenuItem asChild>
										<Link
											to="/admin"
											className="flex items-center cursor-pointer"
										>
											<Shield className="h-4 w-4 mr-2" />
											Admin Dashboard
										</Link>
									</DropdownMenuItem>
								)}
								<DropdownMenuItem
									onClick={handleLogout}
									className="flex items-center cursor-pointer"
								>
									<LogOut className="h-4 w-4 mr-2" />
									Logout
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : null}

					{/* Theme Toggle */}
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setTheme(theme === "light" ? "dark" : "light")}
						className="h-9 w-9 p-0 hover:bg-primary/10 transition-colors duration-200 rounded-lg"
					>
						<Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
						<Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
						<span className="sr-only">Toggle theme</span>
					</Button>
				</div>

				{/* Mobile Menu Button */}
				<div className="lg:hidden ml-auto">
					<Button
						variant="ghost"
						size="sm"
						className="h-10 w-10 p-0"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					>
						{isMobileMenuOpen ? (
							<X className="h-5 w-5" />
						) : (
							<Menu className="h-5 w-5" />
						)}
					</Button>
				</div>
			</div>

			{/* Mobile Menu */}
			{isMobileMenuOpen && (
				<div className="mt-6 pt-6 border-t border-border lg:hidden">
					<div className="flex flex-col space-y-4">
						{navItems.map((item) => (
							<div key={item.name}>
								{item.external ? (
									<a
										href={item.href}
										target="_blank"
										rel="noopener noreferrer"
										className="text-base font-medium transition-colors duration-200 hover:text-primary block py-2"
										onClick={() => setIsMobileMenuOpen(false)}
									>
										{item.name}
									</a>
								) : (
									<Link
										to={item.href}
										className={cn(
											"text-base font-medium transition-colors duration-200 hover:text-primary block py-2",
											location.pathname === item.href && "text-primary",
										)}
										onClick={() => setIsMobileMenuOpen(false)}
									>
										{item.name}
									</Link>
								)}
							</div>
						))}

						{/* Mobile user menu or theme toggle */}
						<div className="pt-4 border-t border-border space-y-2">
							{isLoggedIn ? (
								<>
									<div className="flex items-center space-x-2 py-2">
										<Avatar className="h-6 w-6">
											{user?.github && (
												<AvatarImage
													src={`https://github.com/${user.github}.png`}
													alt={`${user.name}'s avatar`}
												/>
											)}
											<AvatarFallback className="text-xs bg-primary/10 text-primary">
												{user?.name?.[0]?.toUpperCase() || "U"}
											</AvatarFallback>
										</Avatar>
										<span className="text-sm font-medium">
											{user?.name || "User"}
										</span>
									</div>
									<Link
										to="/dashboard"
										className="flex items-center text-base font-medium transition-colors duration-200 hover:text-primary py-2"
										onClick={() => setIsMobileMenuOpen(false)}
									>
										<User className="h-4 w-4 mr-2" />
										Dashboard
									</Link>
									<Link
										to={`/developer/${user?.email}`}
										className="flex items-center text-base font-medium transition-colors duration-200 hover:text-primary py-2"
										onClick={() => setIsMobileMenuOpen(false)}
									>
										<UserCircle className="h-4 w-4 mr-2" />
										Profile
									</Link>
									{user?.role === "admin" && (
										<Link
											to="/admin"
											className="flex items-center text-base font-medium transition-colors duration-200 hover:text-primary py-2"
											onClick={() => setIsMobileMenuOpen(false)}
										>
											<Shield className="h-4 w-4 mr-2" />
											Admin Dashboard
										</Link>
									)}
									<button
										onClick={() => {
											handleLogout();
											setIsMobileMenuOpen(false);
										}}
										className="flex items-center text-base font-medium transition-colors duration-200 hover:text-primary py-2 w-full text-left"
									>
										<LogOut className="h-4 w-4 mr-2" />
										Logout
									</button>
								</>
							) : null}
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setTheme(theme === "light" ? "dark" : "light")}
								className="w-full justify-start h-10 px-3 hover:bg-primary/10 transition-colors duration-200"
							>
								<Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 mr-2" />
								<Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 mr-2" />
								<span className="ml-6">Toggle Theme</span>
							</Button>
						</div>
					</div>
				</div>
			)}
		</nav>
	);
}
