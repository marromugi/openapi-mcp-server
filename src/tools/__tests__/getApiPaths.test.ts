import { describe, it, expect, vi } from "vitest";
import { getAPIPathTool } from "../getApiPaths.js";
import schema from "../../__api__/schema.json" with { type: "json" };

// モック
vi.mock("../../__api__/schema.json", () => ({
  default: {
    paths: {
      "/v1/auth/token": {},
      "/v1/login": {},
      "/v1/users": {},
    },
  },
}));

describe("getAPIPathTool", () => {
  it("すべてのAPIパスを返すこと", async () => {
    // 引数なしで関数を呼び出し
    const result = await getAPIPathTool(
      {},
      {
        requestId: "test",
        sendNotification: vi.fn(),
        sendRequest: vi.fn(),
        signal: AbortSignal.timeout(5000),
      }
    );

    // 期待される結果
    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: "/v1/auth/token\n/v1/login\n/v1/users",
        },
      ],
    });

    // パスが正しく含まれていることを確認
    const paths = Object.keys(schema.paths);
    const resultText = result.content[0].text as string;

    expect(resultText).toContain("/v1/auth/token");
    expect(resultText).toContain("/v1/login");
    expect(resultText).toContain("/v1/users");
    expect(resultText.split("\n").length).toBe(paths.length);
  });
});
