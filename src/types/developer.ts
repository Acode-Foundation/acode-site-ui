export interface DeveloperStats {
	totalPlugins: number;
	totalDownloads: number;
	totalEarnings: number;
	avgRating: number;
}

export interface DeveloperProfile {
	id: number;
	name: string;
	email: string;
	github: string;
	website: string;
	verified: number;
	created_at: string;
	updated_at: string;
}
