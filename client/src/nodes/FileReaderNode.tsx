import { Node, NodeProps } from '@xyflow/react'
import { useState, useRef } from 'react'
import NodeCard from '../components/NodeCard'
import OutputHandle from '../components/OutputHandle'
import useStore from '../store'
import { cn } from '../lib/utils'
import { FiUploadCloud, FiTrash2 } from 'react-icons/fi'
import { Button } from '../components/ui/button'

export type IFileReaderNode = Node<{
  fileName: string
  content: Blob | null
}, 'fileReader'>

export const fileReaderNodeDefaultData = {
  fileName: '',
  content: null
}

const truncateFileName = (fileName: string, maxLength: number = 20) => {
  if (fileName.length <= maxLength) return fileName
  
  const extension = fileName.split('.').pop()
  const nameWithoutExtension = fileName.slice(0, fileName.lastIndexOf('.'))
  const truncatedName = nameWithoutExtension.slice(0, maxLength - 3) + '...'
  
  return `${truncatedName}.${extension}`
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
      updateNodeData(id, {
        fileName: file.name,
        content: file
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
    if (file && (file.type === 'text/plain' || file.type === 'text/csv')) {
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

  const handleRemoveFile = () => {
    updateNodeData(id, {
      fileName: '',
      content: null
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <NodeCard 
      title="File Reader"
      description="Reads and outputs the content of a text file"
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
              accept=".txt,.csv"
              onChange={handleFileInput}
              disabled={isLoading}
            />
            <FiUploadCloud className="w-6 h-6 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium">
                {isLoading ? 'Loading...' : 'Drop file here or click to upload'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports .txt and .csv files
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2 border rounded-md p-2">
            <p className="text-sm text-muted-foreground truncate flex-1" title={data.fileName}>
              {truncateFileName(data.fileName)}
            </p>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemoveFile}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              <FiTrash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <OutputHandle label="Content" />
    </NodeCard>
  )
} 