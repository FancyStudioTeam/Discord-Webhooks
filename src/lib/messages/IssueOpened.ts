/* biome-ignore-all lint/style/useNamingConvention: (x) */

import {
	ContainerBuilder,
	HeadingLevel,
	heading,
	SeparatorBuilder,
	TextDisplayBuilder,
} from '@discordjs/builders';
import type { GitHubIssue, GitHubRepository } from '#/types/GitHub.js';
import { formatRepositoryHyperlink } from '#/utils/markdown/formatRepositoryHyperlink.js';
import { GREEN_COLOR } from '../Colors.js';
import { ISSUE_OPENED_EMOJI } from '../Emojis.js';

export function ISSUE_OPENED_MESSAGE({
	issue,
	repository,
}: IssueOpenedMessageOptions): ContainerBuilder {
	const { body: issueBody, title: issueTitle } = issue;
	const { fullName: repositoryFullName, url: repositoryUrl } = repository;

	const repositoryHyperlink = formatRepositoryHyperlink(repositoryFullName, repositoryUrl);

	const containerBuilder = new ContainerBuilder();
	const containerSeparatorBuilder = new SeparatorBuilder();
	const containerTitleBuilder = new TextDisplayBuilder();

	containerTitleBuilder.setContent(
		heading(
			`${ISSUE_OPENED_EMOJI} ${repositoryHyperlink} - Issue Opened: ${issueTitle}`,
			HeadingLevel.Three,
		),
	);

	containerBuilder.addTextDisplayComponents(containerTitleBuilder);
	containerBuilder.setAccentColor(GREEN_COLOR);

	if (issueBody) {
		const containerBodyBuilder = new TextDisplayBuilder();

		containerBodyBuilder.setContent(issueBody);

		containerBuilder.addSeparatorComponents(containerSeparatorBuilder);
		containerBuilder.addTextDisplayComponents(containerBodyBuilder);
	}

	return containerBuilder;
}

interface IssueOpenedMessageOptions {
	issue: GitHubIssue;
	repository: GitHubRepository;
}
