export interface MonthOption {
	value: number;
	label: string;
}

export const MONTHS: MonthOption[] = [
	{ value: 1, label: "January" },
	{ value: 2, label: "February" },
	{ value: 3, label: "March" },
	{ value: 4, label: "April" },
	{ value: 5, label: "May" },
	{ value: 6, label: "June" },
	{ value: 7, label: "July" },
	{ value: 8, label: "August" },
	{ value: 9, label: "September" },
	{ value: 10, label: "October" },
	{ value: 11, label: "November" },
	{ value: 12, label: "December" },
];

// Generate years array from 2023 to current year
export const generateYearsArray = (startYear: number = 2023): number[] => {
	const currentYear = new Date().getFullYear();
	return Array.from(
		{ length: currentYear - startYear + 1 },
		(_, i) => currentYear - i,
	);
};

export const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};

export const formatDateTime = (dateString: string): string => {
	return new Date(dateString).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
};

export const formatCurrency = (amount: number): string => {
	return amount.toLocaleString("en-IN", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
};

// Get month name from number
export const getMonthName = (monthNumber: number): string => {
	const month = MONTHS.find((m) => m.value === monthNumber);
	return month ? month.label : "Unknown";
};

// Get current date details
export const getCurrentDateDetails = () => {
	const now = new Date();
	return {
		year: now.getFullYear(),
		month: now.getMonth() + 1, // JavaScript months are 0-indexed
		day: now.getDate(),
	};
};
