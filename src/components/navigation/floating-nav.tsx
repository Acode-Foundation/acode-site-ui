import {
	Book,
	CircleHelp,
	LogOut,
	Menu,
	Moon,
	Shield,
	Sun,
	User,
	UserCircle,
	Wallet,
	X,
	Zap,
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
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/ui/theme-provider";
import { EXTERNAL_LINKS } from "@/config/links";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const baseNavItems = [
	{ name: "FAQ", href: "/faq", external: false, icon: CircleHelp },
	{ name: "Plugins", href: "/plugins", external: false, icon: Zap },
	{ name: "Docs", href: EXTERNAL_LINKS.docs, external: true, icon: Book },
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
	const { user, isLoading, isError, logout } = useAuth();

	const isLoggedIn = !isLoading && !isError && user;

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		if (isMobileMenuOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isMobileMenuOpen]);

	const handleLogout = async () => {
		try {
			const response = await logout();
			if (response.ok) {
				toast({
					title: "Logged out successfully",
					description: "You have been logged out.",
				});
				navigate("/");
				window.location.reload();
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
				"fixed top-4 z-50 transition-all duration-300",
				"left-4 right-4 lg:left-1/2 lg:-translate-x-1/2 lg:right-auto",
				"border shadow-lg backdrop-blur-md",
				"rounded-3xl lg:rounded-full",
				isMobileMenuOpen
					? "bg-background/95 border-border/40"
					: "bg-background/70 border-border/20",
				isScrolled &&
					!isMobileMenuOpen &&
					"bg-background/80 shadow-xl border-border/40",
				"px-4 py-3 lg:px-6 lg:py-3",
			)}
		>
			<div
				className={cn(
					"flex items-center justify-between",
					"w-full lg:w-auto lg:gap-1",
				)}
			>
				{/* Logo */}
				<Link
					to="/"
					className="flex items-center gap-2 group shrink-0"
					onClick={() => setIsMobileMenuOpen(false)}
				>
					<div className="relative flex items-center justify-center">
						<div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
						<img
							src={acodeLogoSvg}
							alt="Acode"
							className="h-8 w-8 transition-transform duration-300 group-hover:scale-110 relative z-10"
						/>
					</div>
					<span className="font-bold text-xl tracking-tight hidden sm:block">
						Acode
					</span>
				</Link>

				{/* Divider */}
				<div className="hidden lg:block h-6 w-px bg-border/50 mx-2" />

				{/* Desktop Navigation */}
				<div className="hidden lg:flex items-center gap-1">
					{navItems.map((item) => {
						const isActive = location.pathname === item.href;
						if (authNavItems.includes(item)) return null;

						return (
							<div key={item.name}>
								{item.external ? (
									<a
										href={item.href}
										target="_blank"
										rel="noopener noreferrer"
										className={cn(
											"text-sm font-medium px-4 py-2 rounded-full transition-all duration-200",
											"text-muted-foreground",
											"hover:bg-primary/10 hover:text-primary",
										)}
									>
										{item.name}
									</a>
								) : (
									<Link
										to={item.href}
										className={cn(
											"text-sm font-medium px-4 py-2 rounded-full transition-all duration-200",
											isActive
												? "bg-primary/10 text-primary font-semibold"
												: "text-muted-foreground hover:text-primary hover:bg-primary/10",
										)}
									>
										{item.name}
									</Link>
								)}
							</div>
						);
					})}
				</div>

				{/* Right Actions (Desktop) */}
				<div className="hidden lg:flex items-center gap-2">
					{isLoggedIn ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="pl-2 pr-3 h-9 rounded-full gap-2 border border-border/50 hover:bg-primary/10 hover:text-primary"
								>
									<Avatar className="h-6 w-6">
										{user?.github && (
											<AvatarImage
												src={`https://github.com/${user.github}.png`}
												alt={user.name}
											/>
										)}
										<AvatarFallback className="text-[10px]">
											{user?.name?.[0]?.toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<span className="text-sm font-medium max-w-[100px] truncate">
										{user?.name}
									</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
								<DropdownMenuItem asChild>
									<Link
										to="/dashboard"
										className="flex items-center cursor-pointer rounded-lg"
									>
										<User className="h-4 w-4 mr-2" />
										Dashboard
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link
										to={`/developer/${user?.email}`}
										className="flex items-center cursor-pointer rounded-lg"
									>
										<UserCircle className="h-4 w-4 mr-2" />
										Profile
									</Link>
								</DropdownMenuItem>

								{user?.role === "admin" && (
									<>
										<DropdownMenuSeparator />
										<DropdownMenuItem asChild>
											<Link
												to="/admin"
												className="flex items-center cursor-pointer rounded-lg"
											>
												<Shield className="h-4 w-4 mr-2" />
												Admin
											</Link>
										</DropdownMenuItem>
										<DropdownMenuItem asChild>
											<Link
												to="/admin/payments"
												className="flex items-center cursor-pointer rounded-lg"
											>
												<Wallet className="h-4 w-4 mr-2" />
												Payments
											</Link>
										</DropdownMenuItem>
									</>
								)}

								<DropdownMenuSeparator />

								<DropdownMenuItem
									onClick={handleLogout}
									className="flex items-center cursor-pointer rounded-lg text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/20"
								>
									<LogOut className="h-4 w-4 mr-2" />
									Logout
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<div className="flex items-center gap-1">
							{authNavItems.map((item) => (
								<Link
									key={item.name}
									to={item.href}
									className="text-sm font-medium px-4 py-2 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
								>
									{item.name}
								</Link>
							))}
						</div>
					)}

					<Button
						variant="ghost"
						size="icon"
						onClick={() => setTheme(theme === "light" ? "dark" : "light")}
						className="rounded-full h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10"
					>
						<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
						<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
						<span className="sr-only">Toggle theme</span>
					</Button>
				</div>

				{/* Right Actions (Mobile) */}
				<div className="lg:hidden flex items-center gap-1">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setTheme(theme === "light" ? "dark" : "light")}
						className="rounded-full h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10"
					>
						<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
						<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
						<span className="sr-only">Toggle theme</span>
					</Button>

					<Button
						variant="ghost"
						size="icon"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						className="rounded-full h-9 w-9 hover:bg-primary/10 hover:text-primary"
					>
						<div className="relative h-5 w-5">
							<X
								className={cn(
									"absolute inset-0 h-5 w-5 transition-all duration-300",
									isMobileMenuOpen
										? "rotate-0 opacity-100"
										: "rotate-90 opacity-0",
								)}
							/>
							<Menu
								className={cn(
									"absolute inset-0 h-5 w-5 transition-all duration-300",
									isMobileMenuOpen
										? "-rotate-90 opacity-0"
										: "rotate-0 opacity-100",
								)}
							/>
						</div>
					</Button>
				</div>
			</div>

			{/* Mobile Menu */}
			<div
				className="lg:hidden grid transition-[grid-template-rows] duration-300 ease-out"
				style={{
					gridTemplateRows: isMobileMenuOpen ? "1fr" : "0fr",
				}}
			>
				<div className="overflow-hidden">
					<div className="pt-6 pb-4 px-2">
						<div className="h-px w-full bg-border mb-6" />

						{/* Nav Links */}
						<div className="space-y-1 mb-6">
							{baseNavItems.map((item) => {
								const isActive = location.pathname === item.href;

								return item.external ? (
									<a
										key={item.name}
										href={item.href}
										target="_blank"
										rel="noopener noreferrer"
										className="block px-3 py-3 text-base font-medium text-foreground/80 hover:text-foreground transition-colors"
										onClick={() => setIsMobileMenuOpen(false)}
									>
										{item.name}
									</a>
								) : (
									<Link
										key={item.name}
										to={item.href}
										className={cn(
											"block px-3 py-3 text-base font-medium transition-colors",
											isActive
												? "text-primary"
												: "text-foreground/80 hover:text-foreground",
										)}
										onClick={() => setIsMobileMenuOpen(false)}
									>
										{item.name}
									</Link>
								);
							})}
						</div>

						{isLoggedIn ? (
							<>
								{/* Divider */}
								<div className="h-px w-full bg-border my-4" />

								{/* User Info */}
								<div className="flex items-center gap-3 px-3 py-3 mb-1">
									<Avatar className="h-9 w-9">
										{user?.github && (
											<AvatarImage
												src={`https://github.com/${user.github}.png`}
												alt={user.name}
											/>
										)}
										<AvatarFallback className="text-sm bg-muted text-muted-foreground">
											{user?.name?.[0]?.toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<span className="font-medium text-foreground">
										{user?.name}
									</span>
								</div>

								{/* User Actions */}
								<div className="space-y-1">
									<Link
										to="/dashboard"
										className="flex items-center gap-3 px-3 py-3 text-foreground/80 hover:text-foreground transition-colors"
										onClick={() => setIsMobileMenuOpen(false)}
									>
										<User className="h-5 w-5" strokeWidth={1.5} />
										<span className="font-medium">Dashboard</span>
									</Link>

									<Link
										to={`/developer/${user?.email}`}
										className="flex items-center gap-3 px-3 py-3 text-foreground/80 hover:text-foreground transition-colors"
										onClick={() => setIsMobileMenuOpen(false)}
									>
										<UserCircle className="h-5 w-5" strokeWidth={1.5} />
										<span className="font-medium">Profile</span>
									</Link>

									{user?.role === "admin" && (
										<>
											<Link
												to="/admin"
												className="flex items-center gap-3 px-3 py-3 text-foreground/80 hover:text-foreground transition-colors"
												onClick={() => setIsMobileMenuOpen(false)}
											>
												<Shield className="h-5 w-5" strokeWidth={1.5} />
												<span className="font-medium">Admin Dashboard</span>
											</Link>
											<Link
												to="/admin/payments"
												className="flex items-center gap-3 px-3 py-3 text-foreground/80 hover:text-foreground transition-colors"
												onClick={() => setIsMobileMenuOpen(false)}
											>
												<Wallet className="h-5 w-5" strokeWidth={1.5} />
												<span className="font-medium">Payments</span>
											</Link>
										</>
									)}

									<button
										onClick={() => {
											handleLogout();
											setIsMobileMenuOpen(false);
										}}
										className="flex items-center gap-3 w-full px-3 py-3 text-foreground/80 hover:text-foreground transition-colors"
									>
										<LogOut className="h-5 w-5" strokeWidth={1.5} />
										<span className="font-medium">Logout</span>
									</button>
								</div>
							</>
						) : (
							<>
								{/* Divider */}
								<div className="h-px w-full bg-border my-4" />

								<div className="space-y-1">
									<Link
										to="/login"
										className="block px-3 py-3 text-base font-medium text-foreground/80 hover:text-foreground transition-colors"
										onClick={() => setIsMobileMenuOpen(false)}
									>
										Login
									</Link>
									<Link
										to="/signup"
										className="block px-3 py-3 text-base font-medium text-foreground/80 hover:text-foreground transition-colors"
										onClick={() => setIsMobileMenuOpen(false)}
									>
										Sign Up
									</Link>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
}
