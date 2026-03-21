import { info, setFailed } from '@actions/core';
import type { ContainerBuilder } from '@discordjs/builders';
import { MessageFlags, RouteBases, Routes } from 'discord-api-types/v10';

const { api } = RouteBases;
const { webhook } = Routes;

enum HttpStatusCode {
	BadRequest = 400,
	NotAuthorized = 401,
	NotFound = 404,
	Ok = 200,
}

export class WebhookClient {
	public readonly webhookId: string;
	public readonly webhookToken: string;

	constructor(webhookId: string, webhookToken: string) {
		this.webhookId = webhookId;
		this.webhookToken = webhookToken;
	}

	private createWebhookExecuteRequest(containerBuilder: ContainerBuilder): Request {
		const { webhookId, webhookToken } = this;

		const requestUrl = `${api}/${webhook(webhookId, webhookToken)}?with_components=true`;
		const requestBody = JSON.stringify({
			components: [
				containerBuilder,
			],
			flags: MessageFlags.IsComponentsV2,
		});
		const requestHeaders = {
			'Content-Type': 'application/json',
		};

		const request = new Request(requestUrl, {
			body: requestBody,
			headers: requestHeaders,
			method: 'POST',
		});

		return request;
	}

	public async execute(containerBuilder: ContainerBuilder): Promise<void> {
		const request = this.createWebhookExecuteRequest(containerBuilder);
		const response = await fetch(request);

		const { status } = response;

		switch (status) {
			case HttpStatusCode.Ok: {
				return info('✅ The webhook was executed successfully');
			}
			case HttpStatusCode.BadRequest: {
				const responseJson = await response.json();

				return setFailed(
					`❌ The webhook did not send a valid request: ${JSON.stringify(responseJson, null, 4)}`,
				);
			}
			case HttpStatusCode.NotAuthorized: {
				return setFailed('❌ The webhook was not authorized [Error 401]');
			}
			case HttpStatusCode.NotFound: {
				return setFailed('❌ The webhook was not found [Error 404]');
			}
			default: {
				return setFailed('❌ Something went wrong while executing the webhook');
			}
		}
	}
}
