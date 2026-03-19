import { getInput, setFailed } from '@actions/core';
import { context } from '@actions/github';

import { ISSUE_CLOSED_MESSAGE } from './events/issues/IssueClosed.js';
import { ISSUE_OPENED_MESSAGE } from './events/issues/IssueOpened.js';
import { IssueMessageFunction } from './events/issues/Shared.js';
import { WebhookClient } from './structures/WebhookClient.js';
import type { GitHubIssue, GitHubRepository } from './types/GitHub.js';

async function run(): Promise<void> {
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
				const { action, issue, repository } = payload;

				if (!action) {
					return setFailed('Cannot handle issue without an action');
				}

				if (!issue || !repository) {
					return setFailed('Cannot handle issue without an issue or repository object');
				}

				const messages: Partial<Record<string, IssueMessageFunction>> = {
					closed: ISSUE_CLOSED_MESSAGE,
					opened: ISSUE_OPENED_MESSAGE,
				};

				const message = messages[action];

				if (message) {
					await webhook.execute(
						message({
							issue: issue as GitHubIssue,
							repository: repository as GitHubRepository,
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
