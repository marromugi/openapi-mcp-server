import { z } from "zod";
import schema from "../__api__/schema.json" with { type: "json" };
import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js";

export const getApiDetailsToolSchema = {
  path: z.string().describe("APIのパス (例: /v1/users)"),
  method: z
    .enum(["get", "post", "put", "delete", "patch", "head", "options"])
    .describe("HTTPメソッド"),
};

// OpenAPIのスキーマ構造に合わせた型定義
type OpenAPISchema = typeof schema;
type PathsObject = OpenAPISchema["paths"];
type PathItemObject = {
  get?: OperationObject;
  post?: OperationObject;
  put?: OperationObject;
  delete?: OperationObject;
  patch?: OperationObject;
  head?: OperationObject;
  options?: OperationObject;
  parameters?: any[];
  [key: string]: any;
};
type OperationObject = {
  summary?: string;
  description?: string;
  requestBody?: any;
  responses?: any;
  parameters?: any[];
  tags?: string[];
  [key: string]: any;
};

export const getApiDetailsTool: ToolCallback<
  typeof getApiDetailsToolSchema
> = ({ path, method }) => {
  // パスが存在するか確認
  if (!(path in (schema.paths as any))) {
    return {
      content: [
        {
          type: "text",
          text: `パス「${path}」は見つかりませんでした。`,
        },
      ],
    };
  }

  // メソッドが存在するか確認
  const pathItem = (schema.paths as any)[path] as PathItemObject;
  if (!pathItem[method]) {
    return {
      content: [
        {
          type: "text",
          text: `パス「${path}」に対するメソッド「${method.toUpperCase()}」は見つかりませんでした。`,
        },
      ],
    };
  }

  // API情報を取得
  const endpoint = pathItem[method] as OperationObject;

  // 結果を整形
  let result = `# ${endpoint.summary || "API詳細"}\n\n`;

  // 基本情報
  result += `**パス**: ${path}\n`;
  result += `**メソッド**: ${method.toUpperCase()}\n`;

  // タグ
  if (endpoint.tags && endpoint.tags.length > 0) {
    result += `**タグ**: ${endpoint.tags.join(", ")}\n`;
  }

  // 説明
  if (endpoint.description) {
    result += `\n## 説明\n${endpoint.description}\n`;
  }

  // パラメータ
  if (endpoint.parameters && endpoint.parameters.length > 0) {
    result += `\n## パラメータ\n`;
    for (const param of endpoint.parameters) {
      result += `- **${param.name}** (${param.in}) - ${param.required ? "必須" : "任意"}: ${param.description || "説明なし"}\n`;
      if (param.schema) {
        result += `  - 型: ${param.schema.type || "不明"}\n`;
        if (param.schema.enum) {
          result += `  - 列挙値: ${param.schema.enum.join(", ")}\n`;
        }
      }
    }
  }

  // リクエストボディ
  if (endpoint.requestBody) {
    result += `\n## リクエストボディ\n`;
    const content = endpoint.requestBody.content;

    if (content && content["application/json"]) {
      const schema = content["application/json"].schema;
      result += `コンテンツタイプ: application/json\n`;

      if (schema) {
        result += `\n### スキーマ\n`;
        if (schema.title) {
          result += `タイトル: ${schema.title}\n`;
        }

        if (schema.properties) {
          result += `\n#### プロパティ\n`;
          for (const [propName, propValue] of Object.entries(
            schema.properties
          )) {
            const prop = propValue as any;
            const required =
              schema.required && schema.required.includes(propName)
                ? "必須"
                : "任意";
            result += `- **${propName}** (${required}): ${prop.description || "説明なし"}\n`;
            result += `  - 型: ${prop.type || "不明"}\n`;

            if (prop.example) {
              result += `  - 例: ${typeof prop.example === "object" ? JSON.stringify(prop.example) : prop.example}\n`;
            }
          }
        }
      }
    }
  }

  // レスポンス
  if (endpoint.responses) {
    result += `\n## レスポンス\n`;
    for (const [code, response] of Object.entries(endpoint.responses)) {
      const resp = response as any;
      result += `### ${code} - ${resp.description || "No description"}\n`;

      if (resp.content && resp.content["application/json"]) {
        const schema = resp.content["application/json"].schema;
        if (schema) {
          result += `\n#### スキーマ\n`;
          if (schema.title) {
            result += `タイトル: ${schema.title}\n`;
          }

          if (schema.properties) {
            result += `\n##### プロパティ\n`;
            for (const [propName, propValue] of Object.entries(
              schema.properties
            )) {
              const prop = propValue as any;
              const required =
                schema.required && schema.required.includes(propName)
                  ? "必須"
                  : "任意";
              result += `- **${propName}** (${required}): ${prop.description || "説明なし"}\n`;
              result += `  - 型: ${prop.type || "不明"}\n`;

              if (prop.example) {
                result += `  - 例: ${typeof prop.example === "object" ? JSON.stringify(prop.example) : prop.example}\n`;
              }
            }
          }
        }

        // レスポンス例
        if (resp.content["application/json"].examples) {
          result += `\n#### レスポンス例\n`;
          for (const [exName, example] of Object.entries(
            resp.content["application/json"].examples
          )) {
            const ex = example as any;
            result += `**${exName}**:\n\`\`\`json\n${JSON.stringify(ex.value, null, 2)}\n\`\`\`\n`;
          }
        }
      }
    }
  }

  return {
    content: [
      {
        type: "text",
        text: result,
      },
    ],
  };
};
