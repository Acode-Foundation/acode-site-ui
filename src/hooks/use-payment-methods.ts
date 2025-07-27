import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface PaymentMethod {
  id: string;
  user_id: string;
  paypal_email?: string;
  bank_name?: string;
  bank_account_number?: string;
  bank_ifsc_code?: string;
  bank_swift_code?: string;
  bank_account_holder?: string;
  bank_account_type?: 'savings' | 'current';
  wallet_address?: string;
  wallet_type?: string;
  is_default: number;
  is_deleted: number;
  created_at: string;
  updated_at: string;
}

export interface CreatePaymentMethodData {
  paypal_email?: string;
  bank_name?: string;
  bank_account_number?: string;
  bank_ifsc_code?: string;
  bank_swift_code?: string;
  bank_account_holder?: string;
  bank_account_type?: 'savings' | 'current';
  wallet_address?: string;
  wallet_type?: string;
}

const fetchPaymentMethods = async (userId: string): Promise<PaymentMethod[]> => {
  const response = await fetch(
    `${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/user/payment-methods?user=${userId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch payment methods");
  }

  return response.json();
};

const createPaymentMethod = async (data: CreatePaymentMethodData): Promise<{ message: string }> => {
  const response = await fetch(
    `${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/user/payment-method`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create payment method");
  }

  return response.json();
};

const deletePaymentMethod = async (id: string): Promise<{ message: string }> => {
  const response = await fetch(
    `${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/user/payment-method/${id}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete payment method");
  }

  return response.json();
};

const setDefaultPaymentMethod = async (id: string): Promise<{ message: string }> => {
  const response = await fetch(
    `${import.meta.env.DEV ? import.meta.env.VITE_SERVER_URL : ""}/api/user/payment-method/update-default/${id}`,
    {
      method: "PATCH",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to set default payment method");
  }

  return response.json();
};

export const usePaymentMethods = (userId: string) => {
  return useQuery({
    queryKey: ["paymentMethods", userId],
    queryFn: () => fetchPaymentMethods(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    enabled: !!userId,
  });
};

export const useCreatePaymentMethod = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createPaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
    },
  });
};

export const useDeletePaymentMethod = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deletePaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
    },
  });
};

export const useSetDefaultPaymentMethod = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: setDefaultPaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
    },
  });
};