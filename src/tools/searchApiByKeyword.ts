import { z } from "zod";
import schema from "../__api__/schema.json" with { type: "json" };
import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js";

export const searchApiByKeywordToolSchema = {
  keyword: z.string().describe("検索キーワード"),
  searchInDescription: z
    .boolean()
    .default(true)
    .describe("説明文も検索対象にするかどうか"),
  searchInPath: z
    .boolean()
    .default(true)
    .describe("パス名も検索対象にするかどうか"),
};

interface ApiInfo {
  path: string;
  method: string;
  summary: string;
  description?: string;
}

// OpenAPIのスキーマ構造に合わせた型定義
type OpenAPISchema = typeof schema;
type PathsObject = OpenAPISchema["paths"];
type PathItemObject = PathsObject[keyof PathsObject];
type OperationObject = {
  summary?: string;
  description?: string;
  [key: string]: any;
};

export const searchApiByKeywordTool: ToolCallback<
  typeof searchApiByKeywordToolSchema
> = ({ keyword, searchInDescription = true, searchInPath = true }) => {
  const paths = Object.keys(schema.paths);
  const results: ApiInfo[] = [];

  // キーワードを小文字に変換（大文字小文字を区別しない検索のため）
  const lowercaseKeyword = keyword.toLowerCase();

  for (const path of paths) {
    // パス名で検索
    const pathMatch =
      searchInPath && path.toLowerCase().includes(lowercaseKeyword);

    // パスに対するHTTPメソッドをループ
    const pathItem = (schema.paths as any)[path] as PathItemObject;
    const methods = Object.keys(pathItem).filter((key) =>
      ["get", "post", "put", "delete", "patch", "head", "options"].includes(key)
    );

    for (const method of methods) {
      const endpoint = (pathItem as any)[method] as OperationObject;

      // summaryやdescriptionが存在するか確認
      const summary = endpoint.summary || "";
      const description = endpoint.description || "";

      // 説明文で検索
      const descMatch =
        searchInDescription &&
        (summary.toLowerCase().includes(lowercaseKeyword) ||
          description.toLowerCase().includes(lowercaseKeyword));

      // パス名または説明文にキーワードが含まれていれば結果に追加
      if (pathMatch || descMatch) {
        results.push({
          path,
          method,
          summary,
          description:
            description.length > 100
              ? `${description.substring(0, 100)}...`
              : description,
        });
      }
    }
  }

  // 結果がない場合
  if (results.length === 0) {
    return {
      content: [
        {
          type: "text",
          text: `キーワード「${keyword}」に一致するAPIは見つかりませんでした。`,
        },
      ],
    };
  }

  // 結果を整形
  const formattedResults = results
    .map((result) => {
      return `Path: ${result.path}\nMethod: ${result.method.toUpperCase()}\nSummary: ${result.summary}\nDescription: ${result.description || "なし"}\n`;
    })
    .join("\n---------\n");

  return {
    content: [
      {
        type: "text",
        text: `キーワード「${keyword}」に一致するAPIが${results.length}件見つかりました：\n\n${formattedResults}`,
      },
    ],
  };
};
