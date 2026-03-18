// @ts-check

import type { ContainerBuilder } from '@discordjs/builders';
import { MessageFlags } from 'discord-api-types/v10';

export class WebhookClient {
	readonly webhookId: string;
	readonly webhookToken: string;

	constructor(webhookId: string, webhookToken: string) {
		this.webhookId = webhookId;
		this.webhookToken = webhookToken;
	}

	private _createRequestUrl(): URL {
		const { webhookId, webhookToken } = this;

		const url = new URL(`https://discord.com/api/v10/webhooks/${webhookId}/${webhookToken}`);
		const { searchParams } = url;

		searchParams.set('with_components', 'true');

		return url;
	}

	public async execute(message: ContainerBuilder) {
		const url = this._createRequestUrl();

		await fetch(url, {
			body: JSON.stringify({
				components: [
					message,
				],
				flags: MessageFlags.IsComponentsV2,
			}),
			headers: {
				'content-type': 'application/json',
			},
			method: 'POST',
		});
	}
}
