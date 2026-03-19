/* biome-ignore-all lint/style/useNamingConvention: (x) */

import {
	ContainerBuilder,
	escapeInlineCode,
	HeadingLevel,
	heading,
	hyperlink,
	inlineCode,
	SeparatorBuilder,
	TextDisplayBuilder,
} from '@discordjs/builders';
import type { GitHubIssue, GitHubRepository } from '#/types/GitHub.js';
import { GREEN_COLOR } from '../Colors.js';
import { ISSUE_OPENED_EMOJI } from '../Emojis.js';

export function ISSUE_OPENED_MESSAGE({
	issue,
	repository,
}: IssueOpenedMessageOptions): ContainerBuilder {
	const { body: issueBody, number: issueNumber, title: issueTitle, url: issueUrl } = issue;
	const { fullName: repositoryFullName } = repository;

	const formattedRepositoryFullName = inlineCode(escapeInlineCode(repositoryFullName));

	const containerBuilder = new ContainerBuilder();
	const containerSeparatorBuilder = new SeparatorBuilder();
	const containerTitleBuilder = new TextDisplayBuilder();

	containerTitleBuilder.setContent(
		heading(
			hyperlink(
				`${ISSUE_OPENED_EMOJI} ${formattedRepositoryFullName} [Issue #${issueNumber}]: ${issueTitle}`,
				issueUrl,
			),
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
