interface NotesNodeInput {
  text: string
  input?: string
}

export default async function func({ text, input = '' }: NotesNodeInput) {
  return `${input}\n\nNote: ${text}`
} 