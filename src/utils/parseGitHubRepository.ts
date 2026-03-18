import type { GitHubRepository, RawGitHubRepository } from '#/types/GitHub.js';

export function parseGitHubRepository(payload: Record<string, unknown>): GitHubRepository {
	const { repository } = payload;
	const { full_name: fullName, html_url: url, name } = repository as RawGitHubRepository;

	const gitHubRepository: GitHubRepository = {
		fullName,
		name,
		url,
	};

	return gitHubRepository;
}
