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
import { REPO_PUSH_EMOJI } from '#/lib/Emojis.js';

const GITHUB_COMMIT_HASH_LENGTH = 7;

const GitHubUtils = Object.freeze({
	formatBranch(referenceString: string): string {
		const references = referenceString.split('/');
		const branch = references.at(-1);

		return branch ?? 'unknown';
	},

	formatCommitId(idString: string): string {
		return idString.slice(0, GITHUB_COMMIT_HASH_LENGTH);
	},
});

export const PushEventHandler = Object.freeze({
	appendCommitsToContainer(containerBuilder: ContainerBuilder, commits: Commit[]): void {
		const containerCommits: string[] = [];
		const containerCommitsBuilder = this.createTextDisplayBuilder();

		for (const { id: commitId, message: commitMessage, url: commitUrl } of commits) {
			const formattedCommitId = GitHubUtils.formatCommitId(commitId);
			const formattedCommitMessage = escapeBold(commitMessage);

			const commitHyperlink = hyperlink(inlineCode(formattedCommitId), commitUrl);

			containerCommits.push(bold(`${commitHyperlink} ${formattedCommitMessage}`));
		}

		containerCommitsBuilder.setContent(containerCommits.join('\n'));
		containerBuilder.addTextDisplayComponents(containerCommitsBuilder);
	},

	createContainerBuilder(): ContainerBuilder {
		return new ContainerBuilder();
	},

	createSeparatorBuilder(): SeparatorBuilder {
		return new SeparatorBuilder();
	},

	createTextDisplayBuilder(): TextDisplayBuilder {
		return new TextDisplayBuilder();
	},

	createTitleBuilder(pushEvent: PushEvent): TextDisplayBuilder {
		const titleString = this.formatContainerTitle(pushEvent);
		const titleBuilder = this.createTextDisplayBuilder();

		titleBuilder.setContent(titleString);

		return titleBuilder;
	},

	formatContainerTitle({ commits, compare, ref, repository }: PushEvent): string {
		const { length: commitsLength } = commits;
		const { name: repositoryName } = repository;

		const formattedBranch = GitHubUtils.formatBranch(ref);
		const formattedTitle = escapeMarkdown(
			`${REPO_PUSH_EMOJI} [${repositoryName}] ${commitsLength} new Commit(s) at ${formattedBranch}`,
		);

		return heading(hyperlink(formattedTitle, compare), HeadingLevel.Three);
	},

	handle(pushEvent: PushEvent): ContainerBuilder {
		const { commits } = pushEvent;

		const containerBuilder = this.createContainerBuilder();
		const containerTitleBuilder = this.createTitleBuilder(pushEvent);
		const containerSeparatorBuilder = this.createSeparatorBuilder();

		containerBuilder.addTextDisplayComponents(containerTitleBuilder);
		containerBuilder.addSeparatorComponents(containerSeparatorBuilder);

		this.appendCommitsToContainer(containerBuilder, commits);

		return containerBuilder;
	},
});
