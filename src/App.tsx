import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainLayout } from "@/components/layout/main-layout";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "./pages/Dashboard";
import DeveloperProfile from "./pages/DeveloperProfile";
import Earnings from "./pages/Earnings";
import FAQ from "./pages/FAQ";
import ForgotPassword from "./pages/ForgotPassword";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PluginDetail from "./pages/PluginDetail";
import PluginOrders from "./pages/PluginOrders";
import Plugins from "./pages/Plugins";
import Privacy from "./pages/Privacy";
import Signup from "./pages/Signup";
import SubmitPlugin from "./pages/SubmitPlugin";
import Terms from "./pages/Terms";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000, // 5 minutes
			gcTime: 10 * 60 * 1000, // 10 minutes
			refetchOnWindowFocus: false,
			retry: (failureCount, error) => {
				return failureCount < 2;
			},
		},
	},
});

const App = () => (
	<ErrorBoundary>
		<QueryClientProvider client={queryClient}>
			<ThemeProvider defaultTheme="dark" storageKey="acode-ui-theme">
				<TooltipProvider>
					<Toaster />
					<Sonner />
					<BrowserRouter>
						<MainLayout>
							<Routes>
								<Route path="/" element={<Index />} />
								<Route path="/plugins" element={<Plugins />} />
								<Route path="/plugins/:id" element={<PluginDetail />} />
								<Route path="/submit-plugin" element={<SubmitPlugin />} />
								<Route path="/faq" element={<FAQ />} />
								<Route path="/privacy" element={<Privacy />} />
								<Route path="/terms" element={<Terms />} />
								<Route path="/login" element={<Login />} />
								<Route path="/signup" element={<Signup />} />
								<Route path="/register" element={<Signup />} />
								<Route path="/forgot-password" element={<ForgotPassword />} />
								<Route path="/dashboard" element={<Dashboard />} />
								<Route path="/earnings" element={<Earnings />} />
								<Route
									path="/plugin-orders/:pluginId"
									element={<PluginOrders />}
								/>
								<Route
									path="/developer/:email"
									element={<DeveloperProfile />}
								/>
								<Route path="*" element={<NotFound />} />
							</Routes>
						</MainLayout>
					</BrowserRouter>
				</TooltipProvider>
			</ThemeProvider>
		</QueryClientProvider>
	</ErrorBoundary>
);

export default App;
