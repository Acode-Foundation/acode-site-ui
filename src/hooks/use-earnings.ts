import { useQuery } from "@tanstack/react-query";

interface EarningsData {
	earnings: number;
	month: string;
	year: number;
}

const fetchEarnings = async (year: number, month: number): Promise<EarningsData> => {
	const response = await fetch(
		`${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/earnings/${year}/${month}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
			},
			credentials: "include",
		}
	);

	if (!response.ok) {
		throw new Error("Failed to fetch earnings");
	}

	return response.json();
};

export const useEarnings = (year: number, month: number) => {
	return useQuery({
		queryKey: ["earnings", year, month],
		queryFn: () => fetchEarnings(year, month),
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
		refetchOnWindowFocus: false,
	});
};

export const useCurrentMonthEarnings = () => {
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth(); // 0-indexed
	
	return useEarnings(year, month);
};