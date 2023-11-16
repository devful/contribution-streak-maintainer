#!/usr/bin/env node

import minimist from "minimist";
import { Octokit } from "octokit";
import { retry } from "@octokit/plugin-retry";
import { throttling } from "@octokit/plugin-throttling";
import * as gitUtils from "./utils/gitUtils";
import { getContributions } from "./github/githubApi";
import { logContributionsToday } from "./utils/logger";
import "dotenv/config";

export async function main() {
  try {
    const argv = minimist(process.argv.slice(2), {
      string: ["token", "condition"],
    });

    const [username, repository] = getUsername(argv);
    const token = getToken(argv);
    const condition = getCondition(argv);

    // Initialize Octokit
    const MyOctokit = Octokit.plugin(retry, throttling);
    const octokit = new MyOctokit({
      auth: token,
      log: console,
      userAgent: "contribution-streak-maintainer",
      throttle: {
        onRateLimit: (retryAfter, options: any, octokit, retryCount) => {
          octokit.log.warn(
            `Request quota exhausted for request ${options.method} ${options.url}`
          );
          if (retryCount <= 3) {
            octokit.log.info(`Retrying after ${retryAfter} seconds!`);
            return true;
          }
        },
        onSecondaryRateLimit: (retryAfter, options: any, octokit) => {
          octokit.log.warn(
            `SecondaryRateLimit detected for request ${options.method} ${options.url}`
          );
        },
      },
      retry: { doNotRetry: ["429"] },
    });

    const cloneDirectoryName = `${repository}-clone`;

    if (username && repository) {
      gitUtils.checkGitInstalled();
      gitUtils.gitClone(username, repository, token, cloneDirectoryName);

      const contributions = await getContributions(username, octokit);

      logContributionsToday(contributions);

      // Check if contributions meet the specified condition
      if (contributions <= condition) {
        await gitUtils.generateAndPushCommits(cloneDirectoryName);
      }
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

function getUsername(
  argv: minimist.ParsedArgs
): [string | undefined, string | undefined] {
  const repoString = argv._[0] || process.env.GITHUB_REPO || "";
  const [username, repo] = repoString.split("/", 2);
  return [username || undefined, repo || undefined];
}

function getToken(argv: minimist.ParsedArgs): string {
  return argv.token || process.env.DEVFUL_GITHUB_TOKEN || "";
}

function getCondition(argv: minimist.ParsedArgs): number {
  return +argv.condition || 0;
}

void main();
