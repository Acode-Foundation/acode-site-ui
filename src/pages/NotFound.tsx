import { ArrowLeft, Home } from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
	const location = useLocation();

	useEffect(() => {
		console.error(
			"404 Error: User attempted to access non-existent route:",
			location.pathname,
		);
	}, [location.pathname]);

	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="text-center max-w-md mx-auto px-4">
				<div className="w-24 h-24 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-8">
					<span className="text-4xl font-bold text-white">404</span>
				</div>
				<h1 className="text-4xl font-bold mb-4">Page not found</h1>
				<p className="text-xl text-muted-foreground mb-8">
					The page you're looking for doesn't exist or has been moved.
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Button asChild className="bg-gradient-primary">
						<Link to="/">
							<Home className="w-4 h-4 mr-2" />
							Go Home
						</Link>
					</Button>
					<Button variant="outline" onClick={() => window.history.back()}>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Go Back
					</Button>
				</div>
			</div>
		</div>
	);
};

export default NotFound;
