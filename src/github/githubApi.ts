import { Octokit } from "octokit";
import type { ContributionResponse } from "./githubTypes";

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
