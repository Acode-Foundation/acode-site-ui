import { PluginStatus } from "./plugin";

export interface PluginData {
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
	changelogs: string;
	contributors: string;
	description: string;
	author_email: string;
	author_github: string;
	status?: PluginStatus;
}

export interface Contributor {
	name: string;
	github: string;
	role: string;
}

export interface Review {
	id: number;
	plugin_id: string;
	user_id: number;
	comment: string;
	vote: number;
	created_at: string;
	updated_at: string;
	author_reply: string;
	name: string;
	github: string;
	flagged_by_author?: boolean;
}

export interface ReviewFormData {
	comment: string;
	vote: number;
}

export interface ReplyData {
	reply: string;
}

export interface FlagResponse {
	flagged: boolean;
	message: string;
}

export const VOTE_UP = 1;
export const VOTE_DOWN = -1;
export const VOTE_NULL = 0;
