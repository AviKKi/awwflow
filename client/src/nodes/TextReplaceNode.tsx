import { Edge, Node, NodeProps, useEdges } from '@xyflow/react'
import NodeCard from '../components/NodeCard'
import InputHandle from '../components/InputHandle'
import OutputHandle from '../components/OutputHandle'
import { Textarea } from '../components/ui/textarea'
import useStore from '../store'

export type ITextReplaceNode = Node<{
  text: string
  searchValue: string
  newValue: string
}, 'textReplace'>

export const textReplaceNodeDefaultData = {
  text: '',
  searchValue: '',
  newValue: ''
}

export default function TextReplaceNode({ id, data }: NodeProps<ITextReplaceNode>) {
  const updateNodeData = useStore((state) => state.updateNodeData)
  const edges = useEdges()

  function hasEdge(edges: Edge[], id: string) {
    return edges.some((e) => e.targetHandle === id)
  }

  return (
    <NodeCard
      title="Text Replace"
      description="Replace all occurrences of search text with new text"
    >
      <div className="w-full transition-all duration-300 flex flex-col gap-2">
        <OutputHandle label="Output" />
        
        <InputHandle id="text" label="Text Input">
          {!hasEdge(edges, 'text') && (
            <Textarea
              placeholder="Text to process"
              onChange={(e) => updateNodeData(id, { text: e.target.value })}
              value={data.text}
            />
          )}
        </InputHandle>
        
        <InputHandle id="searchValue" label="Search Text">
          {!hasEdge(edges, 'searchValue') && (
            <Textarea
              placeholder="Text to search for"
              onChange={(e) => updateNodeData(id, { searchValue: e.target.value })}
              value={data.searchValue}
            />
          )}
        </InputHandle>

        <InputHandle id="newValue" label="Replace With">
          {!hasEdge(edges, 'newValue') && (
            <Textarea
              placeholder="Text to replace with"
              onChange={(e) => updateNodeData(id, { newValue: e.target.value })}
              value={data.newValue}
            />
          )}
        </InputHandle>
      </div>
    </NodeCard>
  )
} 