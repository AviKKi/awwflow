import { z } from 'zod'

interface TextTemplateInput {
  template: string
  textInputs: Record<string, string>
}

export default async function func({ template, textInputs }: TextTemplateInput): Promise<string> {
  let result = template
  Object.entries(textInputs).forEach(([key, value]) => {
    const placeholder = `$${key}`
    result = result.replace(placeholder, value)
  })

  return result
}

export const inputSchema = z.object({
  template: z.string(),
  textInputs: z.record(z.string(), z.string())
}) 