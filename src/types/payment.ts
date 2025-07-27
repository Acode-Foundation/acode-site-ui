export interface Payment {
	id: number;
	user_id: number;
	amount: number;
	bank_name?: string;
	bank_account_number?: string;
	paypal_email?: string;
	created_at: string;
	status: string;
	date_from: string;
	date_to: string;
}

export interface PaymentMethod {
	id: string;
	user_id: string;
	paypal_email?: string;
	bank_name?: string;
	bank_account_number?: string;
	bank_ifsc_code?: string;
	bank_swift_code?: string;
	bank_account_holder?: string;
	bank_account_type?: BankAccountType;
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
	bank_account_type?: BankAccountType;
	wallet_address?: string;
	wallet_type?: string;
}

export interface PaymentReceipt {
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

export type PaymentMethodType = "paypal" | "bank" | "crypto";
export type BankAccountType = "savings" | "current";
