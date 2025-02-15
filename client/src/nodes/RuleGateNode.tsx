import { Node, NodeProps } from '@xyflow/react'
import { LucideToggleLeft } from 'lucide-react'
import NodeCard from '../components/NodeCard'
import InputHandle from '../components/InputHandle'
import useStore from '../store'
import { Switch } from '../components/ui/switch'
import { cn } from '../lib/utils'
import { useState } from 'react'
import { useDnD } from '../utils/dragAndDrop'

export type IRuleGateNode = Node<{
  isEnabled: boolean
  width?: number
  height?: number
  className?: string
}, 'ruleGateNode'>

export const ruleGateNodeDefaultData = {
  isEnabled: true,
  width: 400,
  height: 400
}

export function RuleGateNode({ id, data, type }: NodeProps<IRuleGateNode>) {
  const updateNodeData = useStore((state) => state.updateNodeData)
  const [isDropTarget, setIsDropTarget] = useState(false)

  // Handle HTML5 drag and drop for new nodes
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDropTarget(true)
  }

  const onDragLeave = () => {
    setIsDropTarget(false)
  }

  const onDrop = () => {
    setIsDropTarget(false)
  }

  return (
    <div 
      className={cn(
        "border-2 border-dashed rounded-lg transition-colors",
        isDropTarget ? "border-green-500 bg-green-50/50" : "border-gray-200",
        data.isEnabled ? "bg-white/80" : "bg-gray-50/80",
        data.className // Add React Flow's highlight class
      )}
      style={{ 
        width: data.width,
        height: data.height,
        position: 'relative'
      }}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="p-4">
        <NodeCard 
          title="Rule Gate" 
          description="Controls execution of child nodes based on condition"
        >
          <InputHandle 
            id="condition" 
            label="Rule Condition"
          >
            <Switch
              checked={data.isEnabled}
              onCheckedChange={(checked) => updateNodeData(id, { isEnabled: checked })}
            />
          </InputHandle>
          <div className="flex justify-end mt-2">
            <LucideToggleLeft 
              className={data.isEnabled ? 'text-green-500' : 'text-red-500'} 
              size={24}
            />
          </div>
        </NodeCard>
      </div>
    </div>
  )
}

export default RuleGateNode 