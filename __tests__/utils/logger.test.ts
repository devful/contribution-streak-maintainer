import { logContributionsToday } from "../../src/utils/logger";

describe("Logger Tests", () => {
  it("should log contributions today", () => {
    // Mock the console.log method to check if it is called
    const consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});

    logContributionsToday(5);

    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Current contributions today: 5"
    );

    consoleLogSpy.mockRestore();
  });
});
