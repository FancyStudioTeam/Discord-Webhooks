import { getInput, setFailed } from '@actions/core';
import { context } from '@actions/github';
import type { ContainerBuilder } from '@discordjs/builders';
import type { IssuesEvent } from '@octokit/webhooks-types';

import { IssueClosedEventHandler } from './events/issues/IssueClosed.js';
import { IssueOpenedEventHandler } from './events/issues/IssueOpened.js';
import { PushEventHandler } from './events/Push.js';
import { WebhookClient } from './structures/WebhookClient.js';

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
				const { action } = payload as IssuesEvent;

				const messages: IssueEventMessagesMap = {
					closed: IssueClosedEventHandler.handle,
					opened: IssueOpenedEventHandler.handle,
				};
				const message = messages[action];

				if (message) {
					await webhook.execute(message(payload as never));
				}
			}
			case 'push': {
				await webhook.execute(PushEventHandler.handle(payload as never));
			}
		}
	} catch (error) {
		if (error instanceof Error) {
			return setFailed(error.stack ?? error.message);
		}

		setFailed('Unknown Error');
	}
}

void run();

type IssueEventMessagesMap = Partial<{
	[Event in IssuesEvent as Event['action']]: (options: Event) => ContainerBuilder;
}>;
