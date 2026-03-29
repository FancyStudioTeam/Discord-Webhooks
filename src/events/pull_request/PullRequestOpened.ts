import {
	bold,
	ContainerBuilder,
	escapeMarkdown,
	HeadingLevel,
	heading,
	hyperlink,
	TextDisplayBuilder,
} from '@discordjs/builders';
import type { PullRequestOpenedEvent } from '@octokit/webhooks-types';
import { Colors } from '#/lib/Colors.js';

export const PullRequestOpenedEventHandler = {
	createContainerBuilder(): ContainerBuilder {
		return new ContainerBuilder();
	},

	createContainerSubtitleBuilder(
		pullRequestOpenedEvent: PullRequestOpenedEvent,
	): TextDisplayBuilder {
		const subtitleString = this.formatContainerSubtitle(pullRequestOpenedEvent);
		const subtitleBuilder = this.createTextDisplayBuilder();

		subtitleBuilder.setContent(subtitleString);

		return subtitleBuilder;
	},

	createContainerTitleBuilder(
		pullRequestOpenedEvent: PullRequestOpenedEvent,
	): TextDisplayBuilder {
		const titleString = this.formatContainerTitle(pullRequestOpenedEvent);
		const titleBuilder = this.createTextDisplayBuilder();

		titleBuilder.setContent(titleString);

		return titleBuilder;
	},

	createEventContainerBuilder(pullRequestOpenedEvent: PullRequestOpenedEvent): ContainerBuilder {
		const containerBuilder = this.createContainerBuilder();

		const containerSubtitleBuilder =
			this.createContainerSubtitleBuilder(pullRequestOpenedEvent);
		const containerTitleBuilder = this.createContainerTitleBuilder(pullRequestOpenedEvent);

		containerBuilder.setAccentColor(Colors.Emerald);
		containerBuilder.addTextDisplayComponents(containerTitleBuilder, containerSubtitleBuilder);

		return containerBuilder;
	},

	createTextDisplayBuilder(): TextDisplayBuilder {
		return new TextDisplayBuilder();
	},

	formatContainerSubtitle({ pull_request }: PullRequestOpenedEvent): string {
		const {
			html_url: pullRequestHtmlUrl,
			number: pullRequestNumber,
			title: pullRequestTitle,
			user: pullRequestUser,
		} = pull_request;
		const { login: pullRequestUserLogin } = pullRequestUser;

		const formattedTitle = hyperlink(
			escapeMarkdown(`[#${pullRequestNumber}] ${pullRequestTitle} - ${pullRequestUserLogin}`),
			pullRequestHtmlUrl,
		);

		return bold(formattedTitle);
	},

	formatContainerTitle({ pull_request, repository }: PullRequestOpenedEvent): string {
		const { html_url: pullRequestHtmlUrl } = pull_request;
		const { name: repositoryName } = repository;

		const formattedTitle = hyperlink(
			escapeMarkdown(`[${repositoryName}] Pull Request Opened`),
			pullRequestHtmlUrl,
		);

		return heading(formattedTitle, HeadingLevel.Three);
	},
} as const;
