export default async function func({
  content
}: {
  content: Blob | null
}) {
  if (!content) {
    return ''
  }
  
  try {
    const text = await content.text()
    return text
  } catch (error) {
    console.error('Error reading file content:', error)
    return ''
  }
} 