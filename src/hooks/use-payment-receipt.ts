import { useQuery } from "@tanstack/react-query";

interface PaymentReceipt {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  user_id: string;
  paymentMethod: {
    id: string;
    paypal_email?: string;
    bank_name?: string;
    bank_account_number?: string;
    bank_ifsc_code?: string;
    bank_swift_code?: string;
    bank_account_holder?: string;
    bank_account_type?: string;
    wallet_address?: string;
    wallet_type?: string;
  };
}

const fetchPaymentReceipt = async (paymentId: string): Promise<PaymentReceipt> => {
  const response = await fetch(
    `${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/user/receipt/${paymentId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch payment receipt");
  }

  return response.json();
};

export const usePaymentReceipt = (paymentId: string | null) => {
  return useQuery({
    queryKey: ["paymentReceipt", paymentId],
    queryFn: () => fetchPaymentReceipt(paymentId!),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    enabled: !!paymentId,
  });
};