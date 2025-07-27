export interface EarningsData {
	earnings: number;
	month: string;
	year: number;
}

export interface UnpaidEarningsData {
	threshold: number;
	earnings: number;
	from: string;
	to: string;
}
