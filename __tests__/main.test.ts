import { main } from "../src/main";
import * as githubApi from "../src/github/githubApi";

jest.mock("../src/github/githubApi");
jest.mock("../src/utils/logger"); // Mock the logger module

describe("Main Tests", () => {
  it("should call getContributions and logContributionsToday", async () => {
    const mockGetContributions = jest
      .spyOn(githubApi, "getContributions")
      .mockResolvedValue(3);

    await main();

    // Expect that getContributions was called
    expect(mockGetContributions).toHaveBeenCalled();

    // Expect that the logger was called with the correct contribution count
    expect(
      require("../src/utils/logger").logContributionsToday
    ).toHaveBeenCalledWith(3);
  });
});
