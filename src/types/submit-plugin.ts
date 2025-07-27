export interface PluginContributor {
	name: string;
	github?: string;
	role?: string;
}

export interface PluginMetadata {
	id: string;
	name: string;
	version: string;
	author?: string;
	license?: string;
	keywords?: string[];
	contributors?: PluginContributor[];
	minVersionCode?: number;
	price?: number;
	icon?: string;
	repository?: string;
}
