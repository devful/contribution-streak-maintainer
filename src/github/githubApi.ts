import { Octokit } from "octokit";
import { execSync } from "child_process";
import { getFormattedDate } from "../utils/dateUtils";
import { createFileIfNotExists } from "../utils/fileUtils";
import type { ContributionResponse } from "./githubTypes";
import { checkGitInstalled } from "../git/gitCommands";

export async function getContributions(
  username: string,
  octokit: Octokit
): Promise<number> {
  validateUsername(username);

  const contributionsQuery = buildContributionsQuery(username);

  const response = (await octokit.graphql(
    contributionsQuery
  )) as ContributionResponse;

  const todayContributions = findTodayContributions(response);

  return todayContributions?.contributionCount || 0;
}

export async function generateAndPushCommits() {
  checkGitInstalled();

  const filename = "AUTOMATED_CONTRIBUTIONS.md";
  createFileIfNotExists(filename);

  const randomCommitCount = Math.floor(Math.random() * 3) + 1;

  for (let i = 1; i <= randomCommitCount; i++) {
    const commitMessage = getCommitMessage(i);

    // Append the commit message to AUTOMATED_CONTRIBUTIONS.md
    execSync(`echo "${commitMessage}" >> ${filename}`);

    // Stage and commit changes
    execSync(`git add ${filename}`);
    execSync(`git commit -m "${commitMessage}"`);
  }

  execSync("git push");
}

function validateUsername(username: string): void {
  if (!username) {
    throw new Error("Specify username");
  }
}

function buildContributionsQuery(username: string): string {
  return `query {
  user(login: "${username}") {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
          }
        }
      }
    }
  }
}`;
}

function findTodayContributions(response: ContributionResponse):
  | {
      date: string;
      contributionCount: number;
    }
  | undefined {
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  // Find today's contributions
  return response.user.contributionsCollection.contributionCalendar.weeks
    .flatMap((week) => week.contributionDays)
    .find((day) => day.date.split("T")[0] === today);
}

function getCommitMessage(index: number): string {
  const currentDate = new Date();
  const formattedDate = getFormattedDate(currentDate);
  return `Commit: ${formattedDate} #${index}`;
}
