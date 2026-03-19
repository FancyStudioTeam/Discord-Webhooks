import type { GitHubIssue, RawGitHubIssue } from '#/types/GitHub.js';

export function parseGitHubIssue(payload: Record<string, unknown>): GitHubIssue {
	const { issue } = payload;
	const { body, html_url, number, title } = issue as RawGitHubIssue;

	const gitHubIssue: GitHubIssue = {
		body: body ?? null,
		number,
		title,
		url: html_url,
	};

	return gitHubIssue;
}
