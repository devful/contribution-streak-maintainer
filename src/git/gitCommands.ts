import { execSync } from "child_process";

export function checkGitInstalled(): void {
  try {
    execSync("git --version", { stdio: "ignore" });
  } catch (e) {
    console.error("Git is not installed. Please install Git.");
    process.exit(1);
  }
}
