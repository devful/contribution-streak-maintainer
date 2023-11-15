import { execSync } from "child_process";

export function isGitInstalled(): boolean {
  try {
    execSync("git --version", { stdio: "ignore" });
    return true;
  } catch (e) {
    return false;
  }
}

export function checkGitInstalled(): void {
  if (!isGitInstalled()) {
    console.error("Git is not installed. Please install Git.");
    process.exit(1);
  }
}
