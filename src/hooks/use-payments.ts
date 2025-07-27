import { useQuery } from "@tanstack/react-query";
import type { Payment } from "@/types";

const fetchPayments = async (
	userId: string,
	year?: number,
): Promise<Payment[]> => {
	const yearParam = year ? `/${year}` : "";
	const response = await fetch(
		`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/user/payments${yearParam}?user=${userId}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
			},
			credentials: "include",
		},
	);

	if (!response.ok) {
		throw new Error("Failed to fetch payments");
	}

	return response.json();
};

export const usePayments = (userId: string, year?: number) => {
	return useQuery({
		queryKey: ["payments", userId, year],
		queryFn: () => fetchPayments(userId, year),
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
		refetchOnWindowFocus: false,
		enabled: !!userId,
	});
};
