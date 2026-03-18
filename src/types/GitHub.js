/**
 * @typedef {object} GitHubIssue
 *
 * @property {string | null} body
 * @property {string} title
 * @property {url} string;
 */

/**
 * @typedef {object} GitHubRepository
 *
 * @property {string} fullName
 * @property {string} name
 * @property {string} url
 */

/**
 * @typedef {import("@octokit/openapi-types").components['schemas']['issue']} RawGithubIssue
 */

/**
 * @typedef {import("@octokit/openapi-types").components['schemas']['repository']} RawGithubRepository
 */
