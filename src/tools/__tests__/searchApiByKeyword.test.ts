import { describe, it, expect, vi } from "vitest";
import { searchApiByKeywordTool } from "../searchApiByKeyword.js";

// モック
vi.mock("../../__api__/schema.json", () => ({
  default: {
    paths: {
      "/v1/auth/token": {
        post: {
          summary: "アクセストークン再発行",
          description:
            "リフレッシュトークンを渡して、アクセストークンを取得します。",
        },
      },
      "/v1/login": {
        post: {
          summary: "ログイン認証",
          description: "ユーザーIDとパスワードでログイン認証を行います。",
        },
      },
      "/v1/users": {
        get: {
          summary: "ユーザー一覧取得",
          description: "システムに登録されているユーザーの一覧を取得します。",
        },
        post: {
          summary: "ユーザー作成",
          description: "新しいユーザーを作成します。",
        },
      },
    },
  },
}));

describe("searchApiByKeywordTool", () => {
  it("キーワードがパス名に含まれるAPIを検索できること", async () => {
    // パス名にuserを含むAPIを検索
    const result = await searchApiByKeywordTool(
      {
        keyword: "user",
        searchInDescription: false,
        searchInPath: true,
      },
      {
        requestId: "test",
        sendNotification: vi.fn(),
        sendRequest: vi.fn(),
        signal: AbortSignal.timeout(5000),
      }
    );

    // 結果テキストにusersパスが含まれていることを確認
    expect(result.content[0].text).toContain("/v1/users");
    expect(result.content[0].text).not.toContain("/v1/auth/token");
    expect(result.content[0].text).not.toContain("/v1/login");
  });

  it("キーワードが説明文に含まれるAPIを検索できること", async () => {
    // 説明文にトークンを含むAPIを検索
    const result = await searchApiByKeywordTool(
      {
        keyword: "トークン",
        searchInDescription: true,
        searchInPath: false,
      },
      {
        requestId: "test",
        sendNotification: vi.fn(),
        sendRequest: vi.fn(),
        signal: AbortSignal.timeout(5000),
      }
    );

    // 結果テキストにtokenパスが含まれていることを確認
    expect(result.content[0].text).toContain("/v1/auth/token");
    expect(result.content[0].text).not.toContain("/v1/users");
  });

  it("パス名と説明文の両方で検索できること", async () => {
    // パスまたは説明文にログインを含むAPIを検索
    const result = await searchApiByKeywordTool(
      {
        keyword: "ログイン",
        searchInDescription: true,
        searchInPath: true,
      },
      {
        requestId: "test",
        sendNotification: vi.fn(),
        sendRequest: vi.fn(),
        signal: AbortSignal.timeout(5000),
      }
    );

    // 結果テキストにloginパスが含まれていることを確認
    expect(result.content[0].text).toContain("/v1/login");
    expect(result.content[0].text).not.toContain("/v1/users");
    expect(result.content[0].text).not.toContain("/v1/auth/token");
  });

  it("一致するAPIがない場合にエラーメッセージを返すこと", async () => {
    // 存在しないキーワード
    const result = await searchApiByKeywordTool(
      {
        keyword: "存在しないキーワード",
        searchInDescription: true,
        searchInPath: true,
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
      "一致するAPIは見つかりませんでした"
    );
  });
});
