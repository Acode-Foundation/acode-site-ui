import { useQuery } from "@tanstack/react-query";

interface UnpaidEarningsData {
  threshold: number;
  earnings: number;
  from: string;
  to: string;
}

const fetchUnpaidEarnings = async (userId: string): Promise<UnpaidEarningsData> => {
  const response = await fetch(
    `${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/user/unpaid-earnings?user=${userId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch unpaid earnings");
  }

  return response.json();
};

export const useUnpaidEarnings = (userId: string) => {
  return useQuery({
    queryKey: ["unpaidEarnings", userId],
    queryFn: () => fetchUnpaidEarnings(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    enabled: !!userId,
  });
};