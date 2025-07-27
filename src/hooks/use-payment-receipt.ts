import { useQuery } from "@tanstack/react-query";

interface PaymentReceipt {
  id: number;
  created_at: string;
  updated_at: string;
  user_id: number;
  amount: number;
  receipt?: string;
  date_from: string;
  date_to: string;
  status: string;
  payment_method_id: number;
  user_name: string;
  user_email: string;
  bank_name?: string;
  paypal_email?: string;
  bank_account_number?: string;
  paymentMethod: {
    id: number;
    user_id: number;
    created_at: string;
    paypal_email?: string;
    bank_account_number?: string;
    bank_account_type?: string;
    wallet_address?: string;
    wallet_type?: string;
    is_default: number;
    user_name: string;
    user_email: string;
  };
}

const fetchPaymentReceipt = async (paymentId: number): Promise<PaymentReceipt> => {
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