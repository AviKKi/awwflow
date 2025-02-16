import { memo, useState, useCallback } from 'react'
import { Node, NodeProps, NodeResizer } from '@xyflow/react'
import { Textarea } from '../components/ui/textarea'
import InputHandle from '../components/InputHandle'
import OutputHandle from '../components/OutputHandle'
import useStore from '../store'
import { StickyNote } from 'lucide-react'

export type INotesNode = Node<
  {
    text: string
    isEditing: boolean
    width?: number
    height?: number
  },
  "notesNode"
>

export const notesNodeDefaultData = {
  text: 'Double click to edit',
  isEditing: false,
  width: 200,
  height: 150
}

export const notesNodeMetadata = {
  icon: StickyNote,
  title: "Notes",
  description: "Add resizable notes to your workflow",
  type: "notesNode" as const,
}

function NotesNode({ id, data, selected }: NodeProps<INotesNode>) {
  const updateNodeData = useStore((state) => state.updateNodeData)
  const [isEditing, setIsEditing] = useState(data.isEditing)

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true)
  }, [])

  const handleBlur = useCallback(() => {
    setIsEditing(false)
    updateNodeData(id, { ...data, isEditing: false })
  }, [id, data, updateNodeData])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateNodeData(id, { ...data, text: e.target.value })
    },
    [id, data, updateNodeData]
  )

  return (
    <div
      style={{
        width: data.width,
        height: data.height,
        zIndex: -1,
        position: 'relative'
      }}
      className="bg-muted/50 backdrop-blur-sm border rounded-lg shadow-sm"
    >
      <NodeResizer
        minWidth={100}
        minHeight={100}
        isVisible={selected}
        lineClassName="border-muted-foreground"
        handleClassName="bg-muted-foreground"
        onResize={(_, { width, height }) =>
          updateNodeData(id, { ...data, width, height })
        }
      />
      <div className="p-2 w-full h-full">
        {isEditing ? (
          <Textarea
            value={data.text}
            onChange={handleChange}
            onBlur={handleBlur}
            autoFocus
            className="w-full h-full resize-none bg-transparent border-none focus-visible:ring-0 p-0"
          />
        ) : (
          <div
            onDoubleClick={handleDoubleClick}
            className="w-full h-full whitespace-pre-wrap break-words"
          >
            {data.text}
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(NotesNode) 