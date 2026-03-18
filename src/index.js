/// <reference path="types/GitHub.js" />
// @ts-check

import { getInput, setFailed } from "@actions/core";
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

	console.dir(payload, {
		depth: null,
	});
	console.dir(context, {
		depth: null,
	});

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
