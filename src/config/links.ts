/**
 * Centralized configuration for external links and GitHub API
 *
 * This file contains all external links and GitHub configuration used throughout the application.
 * To update any link or GitHub repository, simply modify the values here and it will be updated
 * across all components that use it.
 *
 * Usage:
 * import { EXTERNAL_LINKS, GITHUB_CONFIG, openExternalLink } from "@/config/links";
 *
 * // External links in JSX:
 * <Button onClick={() => openExternalLink(EXTERNAL_LINKS.discord)}>
 *   Join Discord
 * </Button>
 *
 * // Or for simple href:
 * <a href={EXTERNAL_LINKS.docs} target="_blank" rel="noopener noreferrer">
 *   View Documentation
 * </a>
 *
 * // GitHub API usage:
 * fetch(GITHUB_CONFIG.apiUrl)
 * fetch(GITHUB_CONFIG.releasesApiUrl)
 */
export const EXTERNAL_LINKS = {
	discord: "https://discord.gg/nDqZsh7Rqz",
	telegram: "https://t.me/foxdebug_acode",
	docs: "https://docs.acode.app/",
	github: "https://github.com/Acode-Foundation/Acode",
} as const;

// GitHub API configuration
export const GITHUB_CONFIG = {
	repository: "Acode-Foundation/Acode",
	apiUrl: "https://api.github.com/repos/Acode-Foundation/Acode",
	releasesApiUrl:
		"https://api.github.com/repos/Acode-Foundation/Acode/releases/latest",
} as const;

// Helper function to open external links safely
export const openExternalLink = (url: string) => {
	window.open(url, "_blank", "noopener,noreferrer");
};
