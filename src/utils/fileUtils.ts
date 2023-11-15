import { existsSync, writeFileSync } from "fs";

export function createFileIfNotExists(filename: string): void {
  if (!existsSync(filename)) {
    const header = "# Automated Contributions\n\n";
    writeFileSync(filename, header);
  }
}
