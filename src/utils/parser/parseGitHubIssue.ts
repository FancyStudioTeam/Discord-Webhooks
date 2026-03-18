import type { GitHubIssue, RawGitHubIssue } from '#/types/GitHub.js';

export function parseGitHubIssue(payload: Record<string, unknown>): GitHubIssue {
	const { repository } = payload;
	const { body, html_url: url, title } = repository as RawGitHubIssue;

	const gitHubIssue: GitHubIssue = {
		body: body || null,
		title,
		url,
	};

	return gitHubIssue;
}
