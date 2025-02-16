import { Handle, Position, NodeProps, Node } from '@xyflow/react'
import { Button } from '../components/ui/button'
import { Paperclip } from 'lucide-react'
import { NodeMetadata } from '.'
import InputHandle from '@/components/InputHandle'
import OutHandle from '@/components/OutputHandle'

export type IWireClipNode = Node<{
  value?: any
}, 'wireClipNode'>

export const wireClipNodeDefaultData = {
  value: undefined
}

export const wireClipNodeMetadata: NodeMetadata = {
  icon: Paperclip,
  title: 'Wire Clip',
  description: 'Pass-through node for organizing wires',
  type: 'wireClipNode'
}

export default function WireClipNode({ data }: NodeProps<IWireClipNode>) {
  return (
    <div className="relative bg-background border rounded-md p-2 min-w-[60px] min-h-[40px] flex items-center justify-center">
      <InputHandle id="value" label='' />
      <OutHandle label='' />
    </div>
  )
} 