import * as pdfjsLib from 'pdfjs-dist'
import '../../utils/pdf' // Import for PDF.js worker initialization

export default async function func({
  content,
  fileType,
  pageRange
}: {
  content: Blob | null
  fileType: 'text' | 'pdf' | null
  pageRange: {
    start: number
    end: number
  }
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
      const startPage = Math.max(1, pageRange.start)
      const endPage = Math.min(pdf.numPages, pageRange.end)
      
      for (let i = startPage; i <= endPage; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ')
        fullText += `[Page ${i}]\n${pageText}\n\n`
      }
      
      return fullText.trim()
    }

    return ''
  } catch (error) {
    console.error('Error reading file content:', error)
    return ''
  }
} 