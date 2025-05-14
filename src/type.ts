import schema from "./__api__/schema.json" with { type: "json" };

export type HTTPMethod =
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "head"
  | "options"
  | "trace";

export type APIPath = keyof typeof schema.paths;
export type APIMethods<T extends APIPath> = Extract<
  keyof (typeof schema.paths)[T],
  HTTPMethod
>;

export type OpenAPISchema = {
  openapi: string;
  info: {
    title: string;
    version: string;
  };
  servers: {
    url: string;
    description: string;
  }[];
  paths: {
    [key in APIPath]: {
      [method in APIMethods<key>]: {
        description?: string;
        responses?: {
          [key: string]: {
            content: {
              [key: string]: {
                schema: {
                  properties: Record<string, object>;
                };
                example: {
                  [key: string]: Record<string, unknown>;
                };
              };
            };
          };
        };
      };
    };
  };
};

export type OpenAPISchemaPath<T extends APIPath> = OpenAPISchema["paths"][T];
export type OpenAPISchemaPathWithMethod<
  T extends APIPath,
  M extends APIMethods<T>,
> = OpenAPISchemaPath<T>[M];
