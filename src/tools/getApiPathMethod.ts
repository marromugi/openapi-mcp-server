import { z } from "zod";
import schema from "../__api__/schema.json" with { type: "json" };
import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js";

export const getAPIPathMethodToolSchema = {
  path: z.string(),
};

export const getAPIPathMethodTool: ToolCallback<
  typeof getAPIPathMethodToolSchema
> = ({ path }) => {
  const parsedSchema = z
    .object({
      paths: z.object({
        [path]: z.record(z.string(), z.any()),
      }),
    })
    .safeParse(schema);

  if (!parsedSchema.success) {
    return {
      content: [
        {
          type: "text",
          text: "APIパスが見つかりませんでした。",
        },
      ],
    };
  }

  // 指定されたパスのHTTPメソッドを取得
  const methods = Object.keys(parsedSchema.data.paths[path]);
  return {
    content: [
      {
        type: "text",
        text: methods.join("\n"),
      },
    ],
  };
};
