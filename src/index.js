/// <reference path="types/GitHub.js" />
// @ts-check

import { getInput, setFailed, debug } from "@actions/core";
import { WebhookClient } from "./structures/WebhookClient";
import { context } from "@actions/github";

async function execute() {
	const webhookId = getInput("webhook_id");
	const webhookToken = getInput("webhook_token");

	const webhook = new WebhookClient(webhookId, webhookToken);

	const { payload } = context;
	const { repository } = payload;

	// @ts-ignore
	const { full_name } = repository;

	debug(JSON.stringify(context));

	/** @type {GitHubContext} */
	const gitHubContext = {
		repository: {
			name: full_name,
		},
	};

	await webhook.execute(gitHubContext);
}

try {
	execute();
} catch (error) {
	setFailed(error);
}
