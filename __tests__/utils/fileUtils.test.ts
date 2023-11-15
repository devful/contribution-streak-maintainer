import { createFileIfNotExists } from "../../src/utils/fileUtils";
import { existsSync, readFileSync, unlinkSync } from "fs";

describe("File Utils Tests", () => {
  const filename = "testFile.txt";

  afterEach(() => {
    // Clean up the created file after each test
    if (existsSync(filename)) {
      unlinkSync(filename);
    }
  });

  it("should create a file if it does not exist", () => {
    createFileIfNotExists(filename);

    expect(existsSync(filename)).toBe(true);

    const fileContent = readFileSync(filename, "utf-8");

    expect(fileContent).toBe("# Automated Contributions\n\n");
  });
});
