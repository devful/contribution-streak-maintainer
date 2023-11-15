import { Octokit } from "octokit";
import * as githubApi from "../../src/github/githubApi";
import { retry } from "@octokit/plugin-retry";
import { throttling } from "@octokit/plugin-throttling";
import "dotenv/config";

const githubToken = process.env.DEVFUL_GITHUB_TOKEN || "";

const MyOctokit = Octokit.plugin(retry, throttling);

const octokit = new MyOctokit({
  auth: githubToken,
});

describe("GitHub API Tests", () => {
  it("should get contributions", async () => {
    // Call the actual getContributions function
    const contributions = await githubApi.getContributions(
      "eliasafara",
      octokit
    );

    // Assert that contributions is a number and greater than or equal to 0
    expect(typeof contributions).toBe("number");
    expect(contributions).toBeGreaterThanOrEqual(0);
  });
});
