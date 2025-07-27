import { useQuery } from "@tanstack/react-query";
import type { PaymentReceipt } from "@/types";

const fetchPaymentReceipt = async (
	paymentId: number,
): Promise<PaymentReceipt> => {
	const response = await fetch(
		`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/user/receipt/${paymentId}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
			},
			credentials: "include",
		},
	);

	if (!response.ok) {
		throw new Error("Failed to fetch payment receipt");
	}

	return response.json();
};

export const usePaymentReceipt = (paymentId: number | null) => {
	return useQuery({
		queryKey: ["paymentReceipt", paymentId],
		queryFn: () => fetchPaymentReceipt(paymentId!),
		staleTime: 10 * 60 * 1000, // 10 minutes
		gcTime: 30 * 60 * 1000, // 30 minutes
		refetchOnWindowFocus: false,
		enabled: !!paymentId,
	});
};
