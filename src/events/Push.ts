import {
	bold,
	ContainerBuilder,
	escapeBold,
	escapeMarkdown,
	HeadingLevel,
	heading,
	hyperlink,
	inlineCode,
	SeparatorBuilder,
	TextDisplayBuilder,
} from '@discordjs/builders';
import type { Commit, PushEvent } from '@octokit/webhooks-types';

const GITHUB_COMMIT_HASH_LENGTH = 7;

const GitHubUtils = {
	formatBranch(referenceString: string): string {
		const references = referenceString.split('/');
		const branch = references.at(-1);

		return branch ?? 'unknown';
	},

	formatCommitId(idString: string): string {
		return idString.slice(0, GITHUB_COMMIT_HASH_LENGTH);
	},
} as const;

export const PushEventHandler = Object.freeze({
	createContainerBuilder(): ContainerBuilder {
		return new ContainerBuilder();
	},

	createContainerCommitsBuilder({ commits }: PushEvent): TextDisplayBuilder {
		const commitsData: string[] = [];
		const commitsBuilder = this.createTextDisplayBuilder();

		for (const commit of commits) {
			const commitString = this.formatContainerCommit(commit);

			commitsData.push(commitString);
		}

		commitsBuilder.setContent(commitsData.join('\n'));

		return commitsBuilder;
	},

	createContainerTitleBuilder(pushEvent: PushEvent): TextDisplayBuilder {
		const titleString = this.formatContainerTitle(pushEvent);
		const titleBuilder = this.createTextDisplayBuilder();

		titleBuilder.setContent(titleString);

		return titleBuilder;
	},

	createEventContainerBuilder(pushEvent: PushEvent): ContainerBuilder {
		const containerBuilder = this.createContainerBuilder();
		const containerSeparatorBuilder = this.createSeparatorBuilder();

		const containerTitleBuilder = this.createContainerTitleBuilder(pushEvent);
		const containerCommitsBuilder = this.createContainerCommitsBuilder(pushEvent);

		containerBuilder.addTextDisplayComponents(containerTitleBuilder);
		containerBuilder.addSeparatorComponents(containerSeparatorBuilder);
		containerBuilder.addTextDisplayComponents(containerCommitsBuilder);

		return containerBuilder;
	},

	createSeparatorBuilder(): SeparatorBuilder {
		return new SeparatorBuilder();
	},

	createTextDisplayBuilder(): TextDisplayBuilder {
		return new TextDisplayBuilder();
	},

	formatContainerCommit({ id, message, url }: Commit): string {
		const formattedCommitId = GitHubUtils.formatCommitId(id);
		const formattedCommitMessage = escapeBold(message);
		const formattedCommitUrl = hyperlink(inlineCode(formattedCommitId), url);

		return bold(`${formattedCommitUrl} ${formattedCommitMessage}`);
	},

	formatContainerTitle({ commits, compare, ref, repository }: PushEvent): string {
		const { length: commitsLength } = commits;
		const { name: repositoryName } = repository;

		const formattedBranch = GitHubUtils.formatBranch(ref);
		const formattedTitle = hyperlink(
			escapeMarkdown(
				`[${repositoryName}] ${commitsLength} New Commits at ${formattedBranch}`,
			),
			compare,
		);

		return heading(formattedTitle, HeadingLevel.Three);
	},
});
