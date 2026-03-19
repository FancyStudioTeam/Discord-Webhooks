import { getInput, setFailed } from '@actions/core';
import { context } from '@actions/github';
import type { ContainerBuilder } from '@discordjs/builders';
import { ISSUE_OPENED_MESSAGE } from './lib/messages/IssueOpened.js';
import { WebhookClient } from './structures/WebhookClient.js';
import type { GitHubIssue, GitHubRepository } from './types/GitHub.js';
import { parseGitHubIssue } from './utils/parser/parseGitHubIssue.js';
import { parseGitHubRepository } from './utils/parser/parseGitHubRepository.js';

async function run() {
	try {
		const webhookId = getInput('webhook_id');
		const webhookToken = getInput('webhook_token');

		const webhook = new WebhookClient(webhookId, webhookToken);

		const { eventName, payload } = context;

		console.dir(context, {
			colors: true,
			depth: null,
		});

		switch (eventName) {
			case 'issues': {
				const { action } = payload;

				if (!action) {
					return setFailed('Cannot handle issue without an action');
				}

				const issue = parseGitHubIssue(payload);
				const repository = parseGitHubRepository(payload);

				const messages: Partial<Record<string, IssueFunction>> = {
					opened: ISSUE_OPENED_MESSAGE,
				};

				const message = messages[action];

				if (message) {
					await webhook.execute(
						message({
							issue,
							repository,
						}),
					);
				}
			}
		}
	} catch (error) {
		if (error instanceof Error) {
			setFailed(error);
		}
	}
}

run();

type IssueFunction = (options: {
	issue: GitHubIssue;
	repository: GitHubRepository;
}) => ContainerBuilder;
