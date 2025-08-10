export interface Plugin {
	id: string;
	sku: string;
	icon: string;
	name: string;
	price: number;
	author: string;
	user_id: number;
	version: string;
	keywords: string;
	license: string;
	votes_up: number;
	downloads: number;
	repository: string | null;
	votes_down: number;
	comment_count: number;
	author_verified: number;
	min_version_code: number;
	status?: PluginStatus;
}

export interface FilterOptions {
	searchQuery: string;
}

export type PluginFilterType =
	| "default"
	| "most-downloaded"
	| "newest"
	| "recently-updated";

export interface UserPlugin extends Plugin {
	revenue?: number;
}

export type PluginStatus = "pending" | "approved" | "rejected" | "deleted";
