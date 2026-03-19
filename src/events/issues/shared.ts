import { ContainerBuilder } from '@discordjs/builders';

import type { GitHubIssue, GitHubRepository } from '#/types/GitHub.js';

export interface IssueMessageOptions {
	issue: GitHubIssue;
	repository: GitHubRepository;
}

export type IssueMessageFunction = (options: IssueMessageOptions) => ContainerBuilder;
