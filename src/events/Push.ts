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
import { GIT_COMMIT_EMOJI, REPO_PUSH_EMOJI } from '#/lib/Emojis.js';

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
	_appendCommitsToContainer(containerBuilder: ContainerBuilder, commits: Commit[]): void {
		const containerCommits: string[] = [];
		const containerCommitsBuilder = new TextDisplayBuilder();

		for (const { id: commitId, message: commitMessage, url: commitUrl } of commits) {
			const formattedCommitId = GitHubUtils.formatCommitId(commitId);
			const formattedCommitMessage = escapeBold(commitMessage);

			const commitHyperlink = hyperlink(inlineCode(formattedCommitId), commitUrl);

			containerCommits.push(bold(`${GIT_COMMIT_EMOJI} ${commitHyperlink} ${formattedCommitMessage}`));
		}

		containerCommitsBuilder.setContent(containerCommits.join('\n'));
		containerBuilder.addTextDisplayComponents(containerCommitsBuilder);
	},

	_createContainerBuilder(): ContainerBuilder {
		return new ContainerBuilder();
	},

	_createSeparatorBuilder(): SeparatorBuilder {
		return new SeparatorBuilder();
	},

	_createTitleBuilder(pushEvent: PushEvent): TextDisplayBuilder {
		const titleString = this._formatContainerTitle(pushEvent);
		const titleBuilder = new TextDisplayBuilder();

		titleBuilder.setContent(titleString);

		return titleBuilder;
	},

	_formatContainerTitle({ commits, compare, ref, repository }: PushEvent): string {
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

		const containerBuilder = this._createContainerBuilder();
		const containerTitleBuilder = this._createTitleBuilder(pushEvent);
		const containerSeparatorBuilder = this._createSeparatorBuilder();

		containerBuilder.addTextDisplayComponents(containerTitleBuilder);
		containerBuilder.addSeparatorComponents(containerSeparatorBuilder);

		this._appendCommitsToContainer(containerBuilder, commits);

		return containerBuilder;
	},
});
