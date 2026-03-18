export interface GitHubIssue {
	body: string | null;
	title: string;
	url: string;
}

export interface GitHubRepository {
	fullName: string;
	name: string;
	url: string;
}
