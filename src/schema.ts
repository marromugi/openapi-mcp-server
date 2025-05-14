import z from 'zod';

export const openApiPathMethodSchema = z.object({
  description: z.string().optional(),
  responses: z.record(z.string(), z.object({
    content: z.record(z.string(), z.object({
      schema: z.object({
        properties: z.record(z.string(), z.any())
      }),
      example: z.record(z.string(), z.any())
    }))
  }))
})

export const openApiPathSchema = z.object({
  get: openApiPathMethodSchema,
  post: openApiPathMethodSchema,
  put: openApiPathMethodSchema,
  delete: openApiPathMethodSchema,
  patch: openApiPathMethodSchema,
  options: openApiPathMethodSchema,
  head: openApiPathMethodSchema,
}).partial()
