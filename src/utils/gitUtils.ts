import { chdir } from "node:process";
import { execSync, spawnSync } from "node:child_process";

import { getFormattedDate } from "./dateUtils";
import { createFileIfNotExists } from "./fileUtils";

/**
 * Executes a shell command and logs the details. Throws an error if the command fails.
 * @param command - The command to execute.
 * @param args - Arguments to pass to the command.
 */
export function exec(command: string, args: string[]): void {
  console.log(`Executing: ${command} ${args.join(" ")}`);
  const p = spawnSync(command, args, { stdio: "inherit" });
  if (p.status !== 0) {
    console.error(
      `Command failed: ${command} ${args.join(" ")}\n${p.stderr.toString()}`
    );
    throw new Error(`Command failed: ${command} ${args.join(" ")}`);
  }
}

/**
 * Checks if Git is installed by attempting to run "git --version".
 * @returns true if Git is installed, false otherwise.
 */
export function isGitInstalled(): boolean {
  try {
    exec("git", ["--version"]);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Checks if Git is installed and exits the process with an error message if not.
 */
export function checkGitInstalled(): void {
  if (!isGitInstalled()) {
    console.error("Git is not installed. Please install Git.");
    throw new Error("Git is not installed. Please install Git.");
  }
}

/**
 * Clones a GitHub repository using the provided credentials and directory.
 * @param owner - GitHub repository owner.
 * @param repo - GitHub repository name.
 * @param token - GitHub personal access token.
 * @param directory - Directory to clone the repository into.
 */
export function gitClone(
  owner: string,
  repo: string,
  token: string,
  directory: string
): void {
  try {
    console.log(`Cloning repository: ${owner}/${repo}`);
    // Clone the repository with depth 1 to minimize download size
    exec("git", [
      "clone",
      "--depth=1",
      `https://${owner}:${token}@github.com/${owner}/${repo}.git`,
      directory,
    ]);

    chdir(directory);

    // Configure Git user information for the cloned repository
    exec("git", ["config", "user.name", "Contribution Streak Maintainer"]);
    exec("git", [
      "config",
      "user.email",
      "contribution-streak-maintainer@users.noreply.github.com",
    ]);
  } finally {
    chdir("..");
  }
}

export async function generateAndPushCommits(directory: string) {
  try {
    chdir(directory);
    const filename = "AUTOMATED_CONTRIBUTIONS.md";
    createFileIfNotExists(filename);

    const randomCommitCount = Math.floor(Math.random() * 3) + 1;

    for (let i = 1; i <= randomCommitCount; i++) {
      const commitMessage = getCommitMessage();

      // Append the commit message to AUTOMATED_CONTRIBUTIONS.md
      execSync(`echo "${commitMessage}\n" >> ${filename}`);

      console.log("Committing changes...");
      // Stage, commit, and push changes to GitHub
      exec("git", ["add", "."]);
      exec("git", ["status"]);
      exec("git", ["commit", "-m", `"${commitMessage}"`]);
    }
    console.log("Pushing changes...");
    exec("git", ["push"]);
  } finally {
    chdir("..");
  }
}

function getCommitMessage(): string {
  const currentDate = new Date();
  const formattedDate = getFormattedDate(currentDate);
  return `Commit: ${formattedDate}`;
}
