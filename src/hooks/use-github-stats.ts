import { useQuery } from "@tanstack/react-query";
import { GITHUB_CONFIG } from "@/config/links";

export interface GitHubStats {
	stars: number;
	forks: number;
	latestVersion: string;
}

interface GitHubRepoResponse {
	stargazers_count: number;
	forks_count: number;
}

interface GitHubReleaseResponse {
	tag_name: string;
}

const fetchGitHubStats = async (): Promise<GitHubStats> => {
	try {
		const [repoResponse, releaseResponse] = await Promise.all([
			fetch(GITHUB_CONFIG.apiUrl, {
				headers: {
					Accept: "application/vnd.github.v3+json",
				},
			}),
			fetch(GITHUB_CONFIG.releasesApiUrl, {
				headers: {
					Accept: "application/vnd.github.v3+json",
				},
			}),
		]);

		if (!repoResponse.ok || !releaseResponse.ok) {
			throw new Error("Failed to fetch GitHub data");
		}

		const repoData: GitHubRepoResponse = await repoResponse.json();
		const releaseData: GitHubReleaseResponse = await releaseResponse.json();

		return {
			stars: repoData.stargazers_count,
			forks: repoData.forks_count,
			latestVersion: releaseData.tag_name.replace(/^v/, ""), // Remove 'v' prefix if present
		};
	} catch (error) {
		console.warn("GitHub API fetch failed, using fallback data:", error);
		// Fallback data
		return {
			stars: 3000,
			forks: 500,
			latestVersion: "1.11.0",
		};
	}
};

export const useGitHubStats = () => {
	return useQuery({
		queryKey: ["github-stats"],
		queryFn: fetchGitHubStats,
		staleTime: 10 * 60 * 1000, // 10 minutes
		gcTime: 30 * 60 * 1000, // 30 minutes
		refetchOnWindowFocus: false,
		retry: (failureCount, error) => {
			return failureCount < 2;
		},
	});
};
