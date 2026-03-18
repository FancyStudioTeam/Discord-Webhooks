import { escapeInlineCode, hyperlink, inlineCode } from '@discordjs/formatters';

export function formatRepositoryHyperlink(
	repositoryFullName: string,
	repositoryUrl: string,
): string {
	return hyperlink(inlineCode(escapeInlineCode(repositoryFullName)), repositoryUrl);
}
