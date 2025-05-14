import { describe, it, expect, vi } from "vitest";
import { getAPIPathMethodTool } from "../getApiPathMethod.js";
import schema from "../../__api__/schema.json" with { type: "json" };

// モック
vi.mock("../../__api__/schema.json", () => ({
  default: {
    paths: {
      "/v1/auth/token": {
        post: { summary: "トークン発行" },
        get: { summary: "トークン確認" },
      },
      "/v1/login": {
        post: { summary: "ログイン" },
      },
      "/v1/users": {
        get: { summary: "ユーザー一覧取得" },
        post: { summary: "ユーザー作成" },
      },
    },
  },
}));

describe("getAPIPathMethodTool", () => {
  it("正しいパスを指定した場合、そのAPIパスのHTTPメソッドを返すこと", async () => {
    // 引数を指定して関数を呼び出し
    const result = await getAPIPathMethodTool(
      { path: "/v1/auth/token" },
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
          text: "post\nget",
        },
      ],
    });

    // 返されたテキストを検証
    const resultText = result.content[0].text as string;
    expect(resultText.split("\n")).toContain("post");
    expect(resultText.split("\n")).toContain("get");
    expect(resultText.split("\n").length).toBe(2);
  });

  it("存在しないパスを指定した場合、エラーメッセージを返すこと", async () => {
    // 存在しないパスを指定
    const result = await getAPIPathMethodTool(
      { path: "/non-existent-path" },
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
          text: "APIパスが見つかりませんでした。",
        },
      ],
    });
  });
});
