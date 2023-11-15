#!/usr/bin/env node

import minimist from "minimist";
import { Octokit } from "octokit";
import { retry } from "@octokit/plugin-retry";
import { throttling } from "@octokit/plugin-throttling";
import {
  getContributions,
  generateAndPushCommits,
} from "./github/githubApi.js";
import { logContributionsToday } from "./utils/logger.js";

async function main() {
  try {
    const { env } = process;
    const argv = minimist(process.argv.slice(2), {
      string: ["token", "condition"],
    });
    console.log(argv);

    const username = getUsername(argv, env);
    const token = getToken(argv, env);
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

    const contributions = await getContributions(username, octokit);

    logContributionsToday(contributions);

    // Check if contributions meet the specified condition
    if (contributions <= condition) {
      await generateAndPushCommits();
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

function getUsername(
  argv: minimist.ParsedArgs,
  env: NodeJS.ProcessEnv
): string {
  return argv._[0] || env.GITHUB_ACTOR || "";
}

function getToken(argv: minimist.ParsedArgs, env: NodeJS.ProcessEnv): string {
  return argv.token || env.GITHUB_TOKEN || "";
}

function getCondition(argv: minimist.ParsedArgs): number {
  return +argv.condition || 0;
}

void main();
