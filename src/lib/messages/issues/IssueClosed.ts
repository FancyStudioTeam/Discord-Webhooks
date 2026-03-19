/* biome-ignore-all lint/style/useNamingConvention: (x) */

import {
	ContainerBuilder,
	escapeInlineCode,
	HeadingLevel,
	heading,
	hyperlink,
	inlineCode,
	TextDisplayBuilder,
} from '@discordjs/builders';
import { PURPLE_COLOR } from '../../Colors.js';
import { ISSUE_CLOSED_EMOJI } from '../../Emojis.js';
import type { IssueMessageOptions } from './shared.js';

export function ISSUE_CLOSED_MESSAGE({ issue, repository }: IssueMessageOptions): ContainerBuilder {
	const { number: issueNumber, title: issueTitle, url: issueUrl } = issue;
	const { fullName: repositoryFullName } = repository;

	const formattedRepositoryFullName = inlineCode(escapeInlineCode(repositoryFullName));

	const containerBuilder = new ContainerBuilder();
	const containerTitleBuilder = new TextDisplayBuilder();

	containerTitleBuilder.setContent(
		heading(
			hyperlink(
				`${ISSUE_CLOSED_EMOJI} [${formattedRepositoryFullName}] (Issue #${issueNumber}) ${issueTitle}`,
				issueUrl,
			),
			HeadingLevel.Three,
		),
	);

	containerBuilder.addTextDisplayComponents(containerTitleBuilder);
	containerBuilder.setAccentColor(PURPLE_COLOR);

	return containerBuilder;
}
