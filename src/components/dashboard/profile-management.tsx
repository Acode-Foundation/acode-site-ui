import {
	LogOut,
	Settings,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState, useRef, memo } from "react";
import { useNavigate } from "react-router-dom";
import { type QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { PaymentMethods } from "@/components/dashboard/payment-methods";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast.ts";
import type { User } from "@/types";
import { superRefine, z,  } from "zod"
import { useForm } from '@tanstack/react-form'
import type { AnyFieldApi } from '@tanstack/react-form'
import { isValidGithubId } from "@/lib/utils";
import { AuthContextState, useAuth } from "@/context/AuthContext";

// Mock user data
const currentMockUser = {
	name: "John Doe",
	email: "john@example.com",
	role: "user", // "user" or "admin"
	avatar: "JD",
	joinDate: "2024-01-15",
	bio: "Full-stack developer passionate about mobile development and creating tools that enhance productivity.",
	website: "https://johndoe.dev",
	github: "johndoe",
	location: "San Francisco, CA",
	totalEarnings: 245.67,
	bankAccount: {
		accountHolder: "John Doe",
		bankName: "Chase Bank",
		accountNumber: "****1234",
		routingNumber: "****567",
	},
};

/**
 * Handles the user log out process.
 * This function typically invalidates or removes local authentication data,
 * cleans up the cache, and redirects the user.
 * @param {import('@tanstack/react-query').QueryClient} queryClient - The TanStack Query client instance to manage and clear the cache.
 * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} e - The React mouse event from the button click.
 * @param {(to: string) => void} handleRedirect - A callback function used to redirect the user to a new URL after successful log out.
 * It accepts a single string parameter `to` which is the destination URL (e.g., '/login').
 * @returns {Promise<void>} A promise that resolves when the log out process is complete.
 */
const handleLogOut = async (
	queryClient: QueryClient,
	e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	handleRedirect: (to: string) => void,
): Promise<void> => {
	// invalidate the Access Token received while Login.
	try {
		const response = await fetch(
			`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/login`,
			{
				method: "DELETE",
				credentials: "include",
			},
		);

		const responseData =
			response.headers.get("content-type").includes("application/json")
				? await response.json()
				: null;
		if (responseData?.error || !response.ok) {
			toast({
				title: "Unable to Log Out!",
				description:
					responseData.error ||
					`Something went wrong, server responded empty (request status code: ${response.status}). Please try again.`,
				duration: 1500,
				variant: "destructive",
				type: "background"
			});
			// Bad Request, in this case means: response as {error: 'Not Logged in'}
			if (response.status === 400) {
				setTimeout(() => {
					handleRedirect("/login");
				}, 1000);
			}
		} else if (response.ok) {
			toast({
				title: "Logged Out! Redirecting....",
				description:
					responseData.message || "Logged Out Successfully",
				duration: 4000,
				type: "background"
			});
		}

		setTimeout(() => {
			handleRedirect("/login")
		}, 1000);

		await queryClient.invalidateQueries({
			queryKey: ["loggedInUser"],
		});

	} catch (error) {
		toast({
			title: "Unable to Log Out!",
			description: `Something went wrong, server responded empty (error: ${error?.message}). Please try again.`,
			duration: 4000,
		});
	}
};

/**
 * Handles Updating of Profile.
 * @param formData the formData received from the event or mutation (from Tanstack query).
 * @param {(to: string) => void} handleRedirect - A callback function used to redirect the user to a new URL after successful log out.
 * @param emailOtp email OTP only required if Email has been changed/opted to update the email.
 * @returns 
 */
const handleUpdateProfile = async (
	formData: FormData,
	handleRedirect: (to: string) => void,
	updateProfile: AuthContextState["updateProfile"],
	emailOtp?: number,
) => {

	const response = await updateProfile(formData, handleRedirect, emailOtp);

	const responseData = response.headers
		.get("content-type")
		.includes("application/json")
		? await response.json()
		: null;

	if (responseData?.error || !response.ok) {
		// Not Logged-In/Authorized
		if (response.status === 401) {
			toast({
				title: "Failed to Update Profile",
				description: `${responseData?.error} | redirecting....`,
				variant: "destructive",
				duration: 1500,
				type: "background"
			});
			setTimeout(() => {
				handleRedirect("/login");
			}, 1000);
			return { statusCode: response.status };
		}

		const error = new Error(
			`${responseData?.error}` ||
				`Failed to Update Profile (request status code: ${response.status}). Please try again.)`,
		);
		error["code"] = response.status;

		throw error;
	}

	return {
		statusCode: response.status,
		body: responseData as { message: string },
	};
};

const hasEmailChanged = (originalEmail: string, currentEmail: string) => {
	return originalEmail !== currentEmail;
};

function FieldInfo({ field }: { field: AnyFieldApi }) {
	return (
		<>
		  {field.state.meta.isTouched && !field.state.meta.isValid ? (
			<em className="text-sm text-red-600 mt-1">{field.state.meta.errors.map(e => e?.message || e).join(", ")}</em>
		  ) : null}
		  {field.state.meta.isValidating ? 'Validating...' : null}
		</>
	  )
}

// Helper: convert Zod safeParse result into the validator return shape
function zodToFormValidator<T extends object>(schema: z.ZodTypeAny) {
	return async ({ value }: { value: T } | any) => {
	  const parsed = await schema["~standard"].validate(value);
	  if (!parsed.issues) return undefined; // no errors
  
	  // Build { fields: { <path>: <message> } } where path is the field name
	  const fields: Record<string, string> = {};
	  for (const issue of parsed.issues) {
		const path = issue.path.length ? issue.path.join(".") : "_form";
		fields[path] =  fields[path] ? `${fields[path]}, ${issue.message}` : issue.message;
	  }
	  return { fields }; // TanStack Form will map fields -> field.state.meta.errors
	};
  }

type ProfileManagementProps = {
	currentUser: User;
};

const profileManagementSchema = z.object({
	name: z
	  .string()
	  .trim()
	  .min(3, "Name must be at least 3 characters long")
	  .max(255, "Name must not exceed 255 characters"),
	email: z
	  .email()
	  .trim()
	  .max(255, "Email must not exceed 255 characters")
	  .transform((s) => s.toLowerCase()),
	website: z.preprocess(
		(val) => {
		  if (val === undefined || val === null) return "";
		  return String(val).trim();
		},
		z.union([
		  z.literal(""),
		  z.string().max(2048, "Website URL must not exceed 2048 characters.").url("Invalid URL"),
		])
	  ),
	github: z.preprocess(
		(v) => (v == null ? "" : String(v).trim()),
		z.string().superRefine((val, ctx) => {
		  if (val === "") return; // allow empty
		  if (val.length > 255) {
			ctx.addIssue("Github Id must not exceed 255 characters");
			return;
		  }
		  if (!isValidGithubId(val)) {
			ctx.addIssue({ code: "custom", message: "Github Id must be valid" });
		  }
		})
	  ),
  });
  
type ProfileValues = z.infer<typeof profileManagementSchema>;

// Memoized ProfileManagement component to prevent unnecessary re-renders
const ProfileManagement = memo(({ currentUser }: ProfileManagementProps) => {
	const name = (currentUser?.name || "");
	const originalEmail = (currentUser?.email || "")

	const { updateProfile } = useAuth()
	const navigate = useNavigate()
	const form = useForm({
		defaultValues: {
			name: currentUser?.name || "",
			email: currentUser?.email || "",
			website: currentUser?.website || "",
			github: currentUser?.github || "",
		},
		validators: {
			onSubmitAsync: zodToFormValidator<ProfileValues>(profileManagementSchema),
			onChangeAsync: zodToFormValidator<ProfileValues>(profileManagementSchema)
		},
		onSubmit: async ({ value }) => {
			try {
				// value is the validated ProfileValues
				if (hasEmailChanged(originalEmail, value.email)) {
					setShowOTPDialog(true);
					await sendOTPToNewEmail(value.email).catch((err) => {
						toast({
							title: `Email OTP Sending Failed to ${value.email} | Try again, by clicking Submit button.`,
							description: err.message,
							variant: "destructive",
						});
						// not closing the OTP Dialog as User could, click to resend button.
						return null;
				  });
				  
				  return;
				}
	
				  await handleActualSubmit(value);
			} catch (error: any) {
				
			}
		},
	});

	// biome-ignore lint: Kept for Reference Only Should be Removed in PROD.
	// console.table({ name, originalEmail, currentEmail, website, github })

	// State to control when the OTP dialog should be open
	const [showOTPDialog, setShowOTPDialog] = useState(false);

	// State to track the OTP input value
	const otpRef = useRef<HTMLInputElement>(null);

	// State to track loading states
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSendingOTP, setIsSendingOTP] = useState(false);
	const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);

	// State for Error Msgs.
	const [otpError, setOtpError] = useState("");

	const queryClient = useQueryClient();

	const userMutation = useMutation({
		mutationFn: async (body: {
			formData: FormData;
			currentUser: User;
			emailOtp?: number;
		}) =>
			await handleUpdateProfile(body.formData, (toUrl) => navigate(`${toUrl}`), updateProfile,body.emailOtp),
		onSuccess: async (data) => {
			const { statusCode, body } = data;

			// handleUpdateProfile, handles 401. & redirects the User.
			if (statusCode !== 401 && body.message) {
				toast({
					title: "Successfully Updated - User Profile",
					description: `${body.message}` || "User Updated",
					duration: 5000,
				});
				await queryClient.invalidateQueries({ queryKey: ["loggedInUser"] });

				setIsSubmitting(false);
				setIsVerifyingOTP(false);
				setShowOTPDialog(false);
				// setOriginalEmail(currentEmail);
				return;
			}

			return;
		},
		onError: (error) => {
			toast({
				title: "Failed to Update Profile",
				description: `${error.message}`,
				variant: "destructive",
				duration: 5000,
				type: "background"
			});
			setIsSubmitting(false)
			setOtpError(`${error.message}`);
			setIsVerifyingOTP(false)
			return;
		},
	});

	// Profile Management Utils - memoize callback functions

	const sendOTPToNewEmail = async (
		email: string,
		type: "reset" | (string & {}) = "signup",
	) => {
		setIsSendingOTP(true);
		const formData = new FormData();
		formData.append("email", email);

		try {
			const res = await fetch(
				`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/otp?type=${type}`,
				{
					method: "POST",
					credentials: "include",
					body: formData,
					cache: "no-store",
				}
			);
			const responseData = res.headers
				.get("content-type")
				.includes("application/json")
				? await res.json()
				: null;

			if (!res.ok) {
				throw new Error(
					`Email OTP Sending Failed (request status: ${res.status}). As server responded: ${responseData?.error || "empty, Please Try again."}`,
				);
			}

			return responseData as { message: string };
		} catch (error) {
			setOtpError(
				`Failed to send OTP(Please Try Again). Error: ${error.message}`,
			);
		} finally {
			setIsSendingOTP(false);
		}
	};

	const handleActualSubmit = async ({ name, email, website, github }, emailOtp?: number) => {
		setIsSubmitting(true);
		// Create FormData from current form state
		const formData = new FormData();
		formData.append("name", name);
		formData.append("email", email);
		formData.append("website", website);
		formData.append("github", github);

		userMutation.mutate({
			formData,
			currentUser,
			emailOtp,
		});

		// not resetting the states here,
		// as we don't know if it success or failed. We clear/set updated states in mutation itself.
	};

	// const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
	// 	e.preventDefault();
		
	// 	if (hasEmailChanged(originalEmail, currentEmail)) {
	// 		// Email has changed, show OTP dialog and send OTP
	// 		setShowOTPDialog(true);

	// 		// send email OTP
	// 		await sendOTPToNewEmail(currentEmail).catch((e) => {
	// 			toast({
	// 				title: `Email OTP Sending Failed to ${currentEmail} | Try again, by clicking Submit button.`,
	// 				description: e.message,
	// 				variant: "destructive",
	// 			});
	// 			// not closing the OTP Dialog as User could, click to resend button.
	// 			return null;
	// 		});

	// 		return;
	// 	} else {
	// 		await handleActualSubmit();
	// 	}
	// }, [originalEmail, currentEmail, sendOTPToNewEmail, handleActualSubmit]);

	// Handle OTP verification - memoize callback
	const handleOTPVerification = useCallback(async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		e.stopPropagation();
		if (!otpRef.current?.value?.trim()) {
			setOtpError("Please enter the OTP");
			return;
		}

		setIsVerifyingOTP(true);
		setOtpError("");

		if (otpRef.current?.value.length === 6 && /^\d+$/.test(otpRef.current?.value)) {
			// OTP is valid, proceed with form submission
			await handleActualSubmit({ 
				name: form.getFieldValue("name"), 
				email: form.getFieldValue("email"),
				website: form.getFieldValue("website"),
				github: form.getFieldValue("github")
			}, Number(otpRef.current?.value));
		} else {
			setOtpError("Invalid OTP. Please check and try again.");
			setIsVerifyingOTP(false);
		}
	}, [otpRef?.current?.value, handleActualSubmit]);

	// Handle when user cancels the OTP dialog - memoize callback
	const handleCancel = useCallback(() => {
		setShowOTPDialog(false);
		otpRef.current.value = "";
		setOtpError("");
		if(isVerifyingOTP) setIsVerifyingOTP(false)
		form.resetField("email")
	}, [originalEmail]);

	// Handle resending OTP - memoize callback
	const handleResendOTP = useCallback(async () => {
		otpRef.current.value = ""; // Clear current OTP input
		await sendOTPToNewEmail(currentUser.email);
	}, [currentUser?.email, sendOTPToNewEmail]);

	return (
		<div className="space-y-6">
			{/* Profile Information */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="flex items-center gap-2">
							<Settings className="w-5 h-5" />
							Profile Information
						</CardTitle>
						<Button
							variant="destructive"
							size="sm"
							onClick={(e) => handleLogOut(queryClient, e, (toUrl) => navigate(`${toUrl}`))}
						>
							<LogOut className="w-4 h-4 mr-2" />
							Logout
						</Button>
					</div>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-gradient-subtle rounded-lg border border-border/50">
						<Avatar className="w-24 h-24 ring-2 ring-primary/20">
							{currentUser.github ? (
								<AvatarImage
									src={`https://avatars.githubusercontent.com/${currentUser.github}`}
									alt={currentUser.name}
									loading="lazy"
								/>
							) : null}
							<AvatarFallback className="text-2xl bg-gradient-primary text-white">
								{currentUser.name
									.split(" ")
									.map((n) => n[0])
									.join("")}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1 text-center sm:text-left">
							<h3 className="text-xl font-semibold">{currentUser.name}</h3>
							<p className="text-muted-foreground">{currentUser.email}</p>
							<div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
								<Badge variant="outline">{currentUser.role}</Badge>
								{currentUser.verified && (
									<Badge variant="default" className="bg-green-500">
										Verified
									</Badge>
								) || ""}
							</div>
						</div>
						<Button variant="outline" size="sm">
							Change Avatar
						</Button>
					</div>
					<form onSubmit={(e) => {
						 e.preventDefault()
						 e.stopPropagation()
						 form.handleSubmit()
					}} className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<form.Field 
								name="name" 
								children={(field) => {
									return (
										<>
										<div className="space-y-2">
											<Label htmlFor={`${field.name}`}>Full Name</Label>
											<Input 
												id={`${field.name}`}
												name={`${field.name}`}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
											/>
											<FieldInfo field={field} />
										</div>
										</>
									)
								}}
							/>

							<div className="space-y-2">
								<form.Field 
									name="email" 
									children={(field) => {
										return (
											<>
												<Label htmlFor={`${field.name}`}>Email</Label>
												<Input 
													id={`${field.name}`}
													name={`${field.name}`}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
												/>
												<FieldInfo field={field} />
												{/* FIX: Checks on blurs  */}
												{/* Visual indicator when email has changed */}
												{hasEmailChanged(originalEmail, field.state.value) && (
													<p className="text-sm text-orange-600 mt-1">
														Email will be changed from: {originalEmail}
													</p>
												)}
											</>
										)
									}}
								/>
							</div>
							<div className="space-y-2">
							<form.Field 
									name="website" 
									children={(field) => {
										return (
											<>
												<Label htmlFor={`${field.name}`}>Website</Label>
												<Input 
													id={`${field.name}`}
													name={`${field.name}`}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
												/>
												<FieldInfo field={field} />
											</>
										)
									}}
								/>
							</div>
							<div className="space-y-2">
							<form.Field 
									name="github" 
									children={(field) => {
										return (
											<>
												<Label htmlFor={`${field.name}`}>Github</Label>
												<Input 
													id={`${field.name}`}
													name={`${field.name}`}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
												/>
												<FieldInfo field={field} />
											</>
										)
									}}
								/>
							</div>
						</div>

						<form.Subscribe
							selector={(state) => [state.canSubmit, state.isSubmitting]}
							children={([canSubmit, isSubmitting]) => (
								<Button
								className="bg-gradient-primary transition-colors disabled:bg-gradient-dark"
								type="submit"
								disabled={!canSubmit}
								>
									{isSubmitting ? "Updating..." : "Update Profile"}
								</Button>
							)}
						/>
					</form>

					{/* Radix-UI Dialog for OTP Verification */}

					<Dialog open={showOTPDialog} onOpenChange={open => !open && handleCancel()}>
						<DialogContent className="sm:max-w-md">
							<DialogTitle>Verify Your New Email</DialogTitle>
							<DialogDescription>
								We've sent a 6-digit verification code to{" "}
								<strong>{currentUser.email}</strong>. Please enter the code below to
								confirm your email change.
							</DialogDescription>

							<div className="space-y-4">
								<div>
									<Label htmlFor="otp">Verification Code</Label>
									<Input
										id="otp"
										type="text"
										ref={otpRef}
										onChange={(e) => {
											const value = e.target.value
												.replace(/\D/g, "")
												.slice(0, 6);
											otpRef.current.value = value;
											setOtpError("");
										}}
										placeholder="Enter 6-digit code"
										maxLength={6}
										className="text-center text-lg tracking-widest"
									/>
									{otpError && (
										<p className="text-sm text-destructive mt-1">{otpError}</p>
									)}
								</div>

								<div className="text-center">
									<Button
										variant="link"
										onClick={handleResendOTP}
										disabled={isSendingOTP}
									>
										{isSendingOTP ? "Sending..." : "Resend Code"}
									</Button>
								</div>

								<div className="flex gap-2 pt-4">
									<DialogClose>
										<Button
											onClick={handleOTPVerification}
											disabled={isVerifyingOTP}
											className="flex-1"
										>
											{isVerifyingOTP ? "Verifying..." : "Verify & Update"}
										</Button>
									</DialogClose>
									<DialogClose>	
										<Button
											variant="outline"
											onClick={handleCancel}
											className="flex-1"
										>
											Cancel
										</Button>
									</DialogClose>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				</CardContent>
			</Card>

			{/* Payment Methods */}
			<PaymentMethods />
		</div>
	);
});

export default ProfileManagement;