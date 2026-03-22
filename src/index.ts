import { getInput, type InputOptions, info, setFailed } from '@actions/core';
import { context } from '@actions/github';
import { handleEvent } from './lib/Handlers.js';
import type { GitHubContext } from './lib/Types.js';
import { WebhookClient } from './structures/WebhookClient.js';

const GET_INPUT_OPTIONS: InputOptions = {
	required: true,
	trimWhitespace: true,
};

(async () => {
	const gitHubContext = context as unknown as GitHubContext;

	showContextData(gitHubContext);

	const webhookId = getInput('webhook_id', GET_INPUT_OPTIONS);
	const webhookToken = getInput('webhook_token', GET_INPUT_OPTIONS);

	const webhookClient = new WebhookClient(webhookId, webhookToken);

	try {
		await handleEvent(webhookClient, gitHubContext);
	} catch (error) {
		setFailed(`❌ ${error}`);
	}
})();

function showContextData(gitHubContext: GitHubContext): void {
	info(`ℹ️ Context Information: ${JSON.stringify(gitHubContext, null, 4)}`);
}
