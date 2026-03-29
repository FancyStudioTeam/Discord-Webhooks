import {
	ContainerBuilder,
	escapeMarkdown,
	HeadingLevel,
	heading,
	hyperlink,
	TextDisplayBuilder,
} from '@discordjs/builders';
import type { StarCreatedEvent } from '@octokit/webhooks-types';
import { Colors } from '#/lib/Colors.js';

export const StarCreatedEventHandler = {
	createContainerBuilder(): ContainerBuilder {
		return new ContainerBuilder();
	},

	createContainerTitleBuilder(starCreatedEvent: StarCreatedEvent): TextDisplayBuilder {
		const titleString = this.formatContainerTitle(starCreatedEvent);
		const titleBuilder = this.createTextDisplayBuilder();

		titleBuilder.setContent(titleString);

		return titleBuilder;
	},

	createEventContainerBuilder(starCreatedEvent: StarCreatedEvent): ContainerBuilder {
		const containerBuilder = this.createContainerBuilder();
		const containerTitleBuilder = this.createContainerTitleBuilder(starCreatedEvent);

		containerBuilder.setAccentColor(Colors.Amber);
		containerBuilder.addTextDisplayComponents(containerTitleBuilder);

		return containerBuilder;
	},

	createTextDisplayBuilder(): TextDisplayBuilder {
		return new TextDisplayBuilder();
	},

	formatContainerTitle({ repository, sender }: StarCreatedEvent): string {
		const { html_url: repositoryHtmlUrl, name: repositoryName } = repository;
		const { login: senderLogin } = sender;

		const formattedTitle = hyperlink(
			escapeMarkdown(`[${repositoryName}] New Star Added: ${senderLogin}`),
			repositoryHtmlUrl,
		);

		return heading(formattedTitle, HeadingLevel.Three);
	},
} as const;
