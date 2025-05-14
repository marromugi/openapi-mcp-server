import schema from "../__api__/schema.json" with { type: "json" };
import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js";

export const getAPIPathToolSchema = {};

export const getAPIPathTool: ToolCallback<typeof getAPIPathToolSchema> = () => {
  const paths = Object.keys(schema.paths);
  return {
    content: [
      {
        type: "text",
        text: paths.join("\n"),
      },
    ],
  };
};
