import { Node, NodeProps } from '@xyflow/react'
import { useState, useRef, useEffect } from 'react'
import NodeCard from '../components/NodeCard'
import OutputHandle from '../components/OutputHandle'
import useStore from '../store'
import { cn } from '../lib/utils'
import { FiUploadCloud, FiTrash2, FiFile } from 'react-icons/fi'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { getPdfPageCount } from '../utils/pdf'

export type IFileReaderNode = Node<{
  fileName: string
  content: Blob | null
  fileType: 'text' | 'pdf' | null
  pageCount?: number
  pageRange: {
    start: number
    end: number
  }
}, 'fileReader'>

export const fileReaderNodeDefaultData = {
  fileName: '',
  content: null,
  fileType: null,
  pageCount: undefined,
  pageRange: {
    start: 1,
    end: 1
  }
}

export const fileReaderNodeMetadata = {
  icon: FiFile,
  title: "File Reader",
  description: "Read and output text file content",
  type: "fileReader" as const,
}

const truncateFileName = (fileName: string, maxLength: number = 20) => {
  if (fileName.length <= maxLength) return fileName
  
  const extension = fileName.split('.').pop()
  const nameWithoutExtension = fileName.slice(0, fileName.lastIndexOf('.'))
  const truncatedName = nameWithoutExtension.slice(0, maxLength - 3) + '...'
  
  return `${truncatedName}.${extension}`
}

const isValidFileType = (type: string) => {
  return type === 'text/plain' || type === 'text/csv' || type === 'application/pdf'
}

export default function FileReaderNode({ id, data }: NodeProps<IFileReaderNode>) {
  const updateNodeData = useStore((state) => state.updateNodeData)
  const [isLoading, setIsLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file) return

    setIsLoading(true)
    try {
      const fileType = file.type === 'application/pdf' ? 'pdf' : 'text'
      
      let pageCount
      if (fileType === 'pdf') {
        pageCount = await getPdfPageCount(file)
      }

      updateNodeData(id, {
        fileName: file.name,
        content: file,
        fileType,
        pageCount,
        pageRange: {
          start: 1,
          end: pageCount || 1
        }
      })
    } catch (error) {
      console.error('Error reading file:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file && isValidFileType(file.type)) {
      await handleFile(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await handleFile(file)
    }
  }

  const handlePageRangeChange = (type: 'start' | 'end', value: string) => {
    const numValue = parseInt(value) || 1
    const maxPage = data.pageCount || 1
    
    let newStart = type === 'start' ? numValue : data.pageRange.start
    let newEnd = type === 'end' ? numValue : data.pageRange.end

    // Ensure valid range
    newStart = Math.max(1, Math.min(newStart, maxPage))
    newEnd = Math.max(newStart, Math.min(newEnd, maxPage))

    updateNodeData(id, {
      ...data,
      pageRange: {
        start: newStart,
        end: newEnd
      }
    })
  }

  const handleRemoveFile = () => {
    updateNodeData(id, {
      fileName: '',
      content: null,
      fileType: null,
      pageCount: undefined,
      pageRange: {
        start: 1,
        end: 1
      }
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <NodeCard 
      title="File Reader"
      description="Reads and outputs the content of a text or PDF file"
    >
      <div className="p-4 flex flex-col gap-2">
        {!data.fileName ? (
          <div
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              'border-2 border-dashed rounded-md p-4 cursor-pointer',
              'flex flex-col items-center justify-center gap-2 min-h-[100px]',
              'transition-colors duration-200',
              isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/25',
              isLoading && 'opacity-50 cursor-not-allowed'
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".txt,.csv,.pdf"
              onChange={handleFileInput}
              disabled={isLoading}
            />
            <FiUploadCloud className="w-6 h-6 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium">
                {isLoading ? 'Loading...' : 'Drop file here or click to upload'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports .txt, .csv, and .pdf files
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2 border rounded-md p-2">
              <div className="flex flex-col flex-1 min-w-0">
                <p className="text-sm text-muted-foreground truncate" title={data.fileName}>
                  {truncateFileName(data.fileName)}
                </p>
                <p className="text-xs text-muted-foreground/75">
                  {data.fileType === 'pdf' ? 'PDF Document' : 'Text File'}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemoveFile}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <FiTrash2 className="h-4 w-4" />
              </Button>
            </div>

            {data.fileType === 'pdf' && data.pageCount && (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-muted-foreground">
                  Total pages: {data.pageCount}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      type="number"
                      min={1}
                      max={data.pageCount}
                      value={data.pageRange.start}
                      onChange={(e) => handlePageRangeChange('start', e.target.value)}
                      className="w-full"
                      placeholder="Start page"
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">to</span>
                  <div className="flex-1">
                    <Input
                      type="number"
                      min={data.pageRange.start}
                      max={data.pageCount}
                      value={data.pageRange.end}
                      onChange={(e) => handlePageRangeChange('end', e.target.value)}
                      className="w-full"
                      placeholder="End page"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <OutputHandle label="Content" />
    </NodeCard>
  )
} 