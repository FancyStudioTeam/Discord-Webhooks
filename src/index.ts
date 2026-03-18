import { getInput, setFailed } from '@actions/core';
import { WebhookClient } from './structures/WebhookClient.js';
import { context } from '@actions/github';
import { parseGitHubRepository } from './utils/parser/parseGitHubRepository.js';
import type { ContainerBuilder } from '@discordjs/builders';
import { ISSUE_OPENED_MESSAGE } from './lib/messages/IssueOpened.js';
import { parseGitHubIssue } from './utils/parser/parseGitHubIssue.js';

async function execute() {
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

			const messages: Partial<Record<string, ContainerBuilder>> = {
				opened: ISSUE_OPENED_MESSAGE({
					issue,
					repository,
				}),
			};

			const message = messages[action];

			if (message) {
				await webhook.execute(message);
			}
		}
	}
}

try {
	execute();
} catch (error) {
	if (error instanceof Error) {
		setFailed(error);
	}
}
