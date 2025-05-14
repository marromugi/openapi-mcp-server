import { describe, it, expect, vi } from "vitest";
import { getApiDetailsTool } from "../getApiDetails.js";

// モック
vi.mock("../../__api__/schema.json", () => ({
  default: {
    paths: {
      "/v1/auth/token": {
        post: {
          summary: "アクセストークン再発行",
          description:
            "リフレッシュトークンを渡して、アクセストークンを取得します。",
          tags: ["login"],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  title: "アクセストークン再発行リクエスト",
                  type: "object",
                  properties: {
                    refreshToken: {
                      type: "string",
                      description: "リフレッシュトークン",
                      example: "0d880675-d5d8-49dc-97b4-43451c8518f8",
                    },
                  },
                  required: ["refreshToken"],
                },
              },
            },
          },
          responses: {
            "200": {
              description: "処理成功",
              content: {
                "application/json": {
                  schema: {
                    title: "アクセストークン再発行レスポンス",
                    type: "object",
                    properties: {
                      accessToken: {
                        type: "string",
                        description: "アクセストークン",
                        example: "abcdefghijklmn",
                      },
                    },
                    required: ["accessToken"],
                  },
                  examples: {
                    正常: {
                      value: {
                        accessToken: "abcdefghijklmn",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/v1/users": {
        get: {
          summary: "ユーザー一覧取得",
          description: "システムに登録されているユーザーの一覧を取得します。",
          parameters: [
            {
              name: "page",
              in: "query",
              required: false,
              description: "ページ番号",
              schema: {
                type: "integer",
                minimum: 1,
              },
            },
            {
              name: "limit",
              in: "query",
              required: false,
              description: "1ページあたりの件数",
              schema: {
                type: "integer",
                minimum: 1,
                maximum: 100,
              },
            },
          ],
          responses: {
            "200": {
              description: "成功",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      users: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: {
                              type: "string",
                              description: "ユーザーID",
                            },
                            name: {
                              type: "string",
                              description: "ユーザー名",
                            },
                          },
                        },
                      },
                      total: {
                        type: "integer",
                        description: "総件数",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
}));

describe("getApiDetailsTool", () => {
  it("パスとメソッドが存在する場合に詳細情報を取得できること", async () => {
    // 存在するパスとメソッドを指定
    const result = await getApiDetailsTool(
      {
        path: "/v1/auth/token",
        method: "post",
      },
      {
        requestId: "test",
        sendNotification: vi.fn(),
        sendRequest: vi.fn(),
        signal: AbortSignal.timeout(5000),
      }
    );

    // 基本情報が含まれていることを確認
    expect(result.content[0].text).toContain("アクセストークン再発行");
    expect(result.content[0].text).toContain("/v1/auth/token");
    expect(result.content[0].text).toContain("POST");

    // リクエストボディ情報が含まれていることを確認
    expect(result.content[0].text).toContain("リクエストボディ");
    expect(result.content[0].text).toContain("refreshToken");

    // レスポンス情報が含まれていることを確認
    expect(result.content[0].text).toContain("レスポンス");
    expect(result.content[0].text).toContain("200");
    expect(result.content[0].text).toContain("accessToken");
  });

  it("パラメータを持つAPIの詳細情報を正しく表示できること", async () => {
    // パラメータを持つAPIを指定
    const result = await getApiDetailsTool(
      {
        path: "/v1/users",
        method: "get",
      },
      {
        requestId: "test",
        sendNotification: vi.fn(),
        sendRequest: vi.fn(),
        signal: AbortSignal.timeout(5000),
      }
    );

    // パラメータ情報が含まれていることを確認
    expect(result.content[0].text).toContain("パラメータ");
    expect(result.content[0].text).toContain("page");
    expect(result.content[0].text).toContain("limit");
    expect(result.content[0].text).toContain("query");
  });

  it("存在しないパスを指定した場合にエラーメッセージを返すこと", async () => {
    // 存在しないパスを指定
    const result = await getApiDetailsTool(
      {
        path: "/non-existent-path",
        method: "get",
      },
      {
        requestId: "test",
        sendNotification: vi.fn(),
        sendRequest: vi.fn(),
        signal: AbortSignal.timeout(5000),
      }
    );

    // エラーメッセージが含まれていることを確認
    expect(result.content[0].text).toContain(
      "パス「/non-existent-path」は見つかりませんでした"
    );
  });

  it("存在しないメソッドを指定した場合にエラーメッセージを返すこと", async () => {
    // 存在しないメソッドを指定
    const result = await getApiDetailsTool(
      {
        path: "/v1/auth/token",
        method: "get",
      },
      {
        requestId: "test",
        sendNotification: vi.fn(),
        sendRequest: vi.fn(),
        signal: AbortSignal.timeout(5000),
      }
    );

    // エラーメッセージが含まれていることを確認
    expect(result.content[0].text).toContain(
      "パス「/v1/auth/token」に対するメソッド「GET」は見つかりませんでした"
    );
  });
});
