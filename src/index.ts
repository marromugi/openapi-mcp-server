import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  getAPIPathMethodToolSchema,
  getAPIPathMethodTool,
} from "./tools/getApiPathMethod.js";
import { getAPIPathToolSchema, getAPIPathTool } from "./tools/getApiPaths.js";
import {
  searchApiByKeywordToolSchema,
  searchApiByKeywordTool,
} from "./tools/searchApiByKeyword.js";
import {
  getApiDetailsToolSchema,
  getApiDetailsTool,
} from "./tools/getApiDetails.js";

const SERVER_NAME = "myapi";

const server = new McpServer({
  name: `${SERVER_NAME}-openapi-mcp-server`,
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

server.tool(
  "get-api-paths",
  "Get all API paths.",
  getAPIPathToolSchema,
  getAPIPathTool
);

server.tool(
  "get-api-path-method",
  "Get the methods of the specified API path.",
  getAPIPathMethodToolSchema,
  getAPIPathMethodTool
);

server.tool(
  "search-api-by-keyword",
  "Search the API path and description by keyword.",
  searchApiByKeywordToolSchema,
  searchApiByKeywordTool
);

server.tool(
  "get-api-details",
  "Get the API details of the specified path and method.",
  getApiDetailsToolSchema,
  getApiDetailsTool
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.info(`${SERVER_NAME} MCP Server running on stdio`);
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
