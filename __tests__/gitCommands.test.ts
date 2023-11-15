import { isGitInstalled } from "../src/git/gitCommands";
import { execSync } from "child_process";

jest.mock("child_process");

describe("Git Commands Tests", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return true if Git is installed", () => {
    // Mocking execSync to simulate Git being installed
    (execSync as jest.Mock).mockReturnValue("git version 2.30.1");

    const isInstalled = isGitInstalled();
    expect(isInstalled).toBe(true);
  });

  it("should return false if Git is not installed", () => {
    // Mocking execSync to throw an error (simulating Git not installed)
    (execSync as jest.Mock).mockImplementation(() => {
      throw new Error("Command failed: git --version");
    });

    const isInstalled = isGitInstalled();
    expect(isInstalled).toBe(false);
  });
});
