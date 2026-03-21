import {
	bold,
	ContainerBuilder,
	escapeBold,
	escapeMarkdown,
	HeadingLevel,
	heading,
	hyperlink,
	SeparatorBuilder,
	TextDisplayBuilder,
} from '@discordjs/builders';
import type { IssuesOpenedEvent } from '@octokit/webhooks-types';
import { GREEN_COLOR } from '#/lib/Colors.js';
import { ISSUE_OPENED_EMOJI } from '#/lib/Emojis.js';

export const IssueOpenedEventHandler = Object.freeze({
	appendBodyToContainer(containerBuilder: ContainerBuilder, issueBody?: string | null): void {
		if (issueBody) {
			const containerSeparatorBuilder = this.createSeparatorBuilder();
			const containerBodyBuilder = this.createTextDisplayBuilder();

			containerBodyBuilder.setContent(issueBody);

			containerBuilder.addSeparatorComponents(containerSeparatorBuilder);
			containerBuilder.addTextDisplayComponents(containerBodyBuilder);
		}
	},

	createContainerBuilder(): ContainerBuilder {
		return new ContainerBuilder();
	},

	createSeparatorBuilder(): SeparatorBuilder {
		return new SeparatorBuilder();
	},

	createSubtitleBuilder(issueOpenedEvent: IssuesOpenedEvent): TextDisplayBuilder {
		const subtitleString = this.formatContainerSubtitle(issueOpenedEvent);
		const subtitleBuilder = this.createTextDisplayBuilder();

		subtitleBuilder.setContent(subtitleString);

		return subtitleBuilder;
	},

	createTextDisplayBuilder(): TextDisplayBuilder {
		return new TextDisplayBuilder();
	},

	createTitleBuilder(issueOpenedEvent: IssuesOpenedEvent): TextDisplayBuilder {
		const titleString = this.formatContainerTitle(issueOpenedEvent);
		const titleBuilder = this.createTextDisplayBuilder();

		titleBuilder.setContent(titleString);

		return titleBuilder;
	},

	formatContainerSubtitle(issueOpenedEvent: IssuesOpenedEvent): string {
		const { issue } = issueOpenedEvent;
		const { title: issueTitle } = issue;

		return bold(escapeBold(issueTitle));
	},

	formatContainerTitle(issueOpenedEvent: IssuesOpenedEvent): string {
		const { issue, repository, sender } = issueOpenedEvent;

		const { html_url: issueHtmlUrl, number: issueNumber } = issue;
		const { name: repositoryName } = repository;
		const { login: senderLogin } = sender;

		const formattedTitle = escapeMarkdown(
			`${ISSUE_OPENED_EMOJI} [${repositoryName}] ${senderLogin} has Opened Issue #${issueNumber}`,
		);

		return heading(hyperlink(formattedTitle, issueHtmlUrl), HeadingLevel.Three);
	},

	handle(issueOpenedEvent: IssuesOpenedEvent): ContainerBuilder {
		const { issue } = issueOpenedEvent;
		const { body: issueBody } = issue;

		const containerBuilder = this.createContainerBuilder();
		const containerTitleBuilder = this.createTitleBuilder(issueOpenedEvent);
		const containerSubtitleBuilder = this.createSubtitleBuilder(issueOpenedEvent);

		containerBuilder.setAccentColor(GREEN_COLOR);
		containerBuilder.addTextDisplayComponents(containerTitleBuilder, containerSubtitleBuilder);

		this.appendBodyToContainer(containerBuilder, issueBody);

		return containerBuilder;
	},
});
