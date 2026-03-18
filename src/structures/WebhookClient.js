// @ts-check

import { MessageFlags } from "discord-api-types/v10";
import {
	ContainerBuilder,
	heading,
	HeadingLevel,
	inlineCode,
	TextDisplayBuilder,
} from "@discordjs/builders";

export class WebhookClient {
	/**
	 * Creates a new {@link WebhookClient} instance.
	 *
	 * @param {string} webhookId The ID of the Discord webhook.
	 * @param {string} webhookToken The token of the Discord webhook.
	 */
	constructor(webhookId, webhookToken) {
		this.webhookId = webhookId;
		this.webhookToken = webhookToken;
	}

	/**
	 * Creates a new {@link URL} instance for the Discord request.
	 *
	 * @returns {URL} The created {@link URL} instance.
	 * @private
	 */
	_createRequestUrl() {
		const { webhookId, webhookToken } = this;

		const url = new URL(
			`https://discord.com/api/v10/webhooks/${webhookId}/${webhookToken}`,
		);
		const { searchParams } = url;

		searchParams.set("with_components", "true");

		return url;
	}

	/**
	 * Executes the Discord webhook with the provided context.
	 *
	 * @param {GitHubContext} context The context from the GitHub Action.
	 *
	 * @returns {Promise<void>} Nothing.
	 */
	async execute(context) {
		const { repository } = context;
		const { name: repositoryName } = repository;

		const url = this._createRequestUrl();

		await fetch(url, {
			body: JSON.stringify({
				flags: MessageFlags.IsComponentsV2,
				components: [
					new ContainerBuilder().addTextDisplayComponents(
						new TextDisplayBuilder().setContent(
							heading(
								`${inlineCode(`[${repositoryName}]`)}`,
								HeadingLevel.Three,
							),
						),
					),
				],
			}),
			headers: {
				"content-type": "application/json",
			},
			method: "POST",
		});
	}
}
