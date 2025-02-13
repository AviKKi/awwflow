import { Node, NodeProps } from '@xyflow/react'
import { useState } from 'react'
import NodeCard from '../components/NodeCard'
import OutputHandle from '../components/OutputHandle'
import useStore from '../store'
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
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

  return (
    <NodeCard 
      title="File Reader"
      description="Reads and outputs the content of a text file"
    >
      <div className="p-4 flex flex-col gap-2">
        <Button
          variant="outline"
          className="relative"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Upload Text File'}
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept=".txt,.csv"
            onChange={handleFileUpload}
            disabled={isLoading}
          />
        </Button>
        {data.fileName && (
          <p className="text-sm text-muted-foreground truncate" title={data.fileName}>
            File: {truncateFileName(data.fileName)}
          </p>
        )}
      </div>
      <OutputHandle label="Content" />
    </NodeCard>
  )
} 