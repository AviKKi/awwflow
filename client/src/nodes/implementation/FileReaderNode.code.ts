import * as pdfjsLib from 'pdfjs-dist'
import { GlobalWorkerOptions } from 'pdfjs-dist'

// Initialize PDF.js worker
if (typeof window !== 'undefined') {
  GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString()
}

export default async function func({
  content,
  fileType
}: {
  content: Blob | null
  fileType: 'text' | 'pdf' | null
}) {
  if (!content || !fileType) {
    return ''
  }

  try {
    if (fileType === 'text') {
      return await content.text()
    }

    if (fileType === 'pdf') {
      const arrayBuffer = await content.arrayBuffer()
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
      const pdf = await loadingTask.promise
      
      let fullText = ''
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ')
        fullText += pageText + '\n\n'
      }
      
      return fullText.trim()
    }

    return ''
  } catch (error) {
    console.error('Error reading file content:', error)
    return ''
  }
} 