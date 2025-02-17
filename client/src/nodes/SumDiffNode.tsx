import { Node, NodeProps } from '@xyflow/react'
import NodeCard from '../components/NodeCard'
import InputHandle from '../components/InputHandle'
import OutputHandle from '../components/OutputHandle'
import useStore from '../store'
import { Calculator } from 'lucide-react'

export type ISumDiffNode = Node<{
  number1: string
  number2: string
}, 'sumDiffNode'>

export const sumDiffNodeDefaultData = {
  number1: '0',
  number2: '0'
}

export const sumDiffNodeMetadata = {
    icon: Calculator ,
    title: 'Sum & Difference',
    description: 'Calculate sum and difference of two numbers',
    type: 'sumDiffNode'
  }

export default function SumDiffNode({ id, data }: NodeProps<ISumDiffNode>) {
  const updateNodeData = useStore((state) => state.updateNodeData)

  return (
    <NodeCard 
      title="Sum & Difference"
      description="Calculate sum and difference of two numbers"
    >
      <div className="flex flex-col gap-2 p-2">
        <InputHandle id="number1" label="Number 1">
          <input
            type="number"
            className="w-full rounded-md border px-2 py-1"
            value={data.number1}
            onChange={(e) => updateNodeData(id, { number1: e.target.value })}
          />
        </InputHandle>
        <InputHandle id="number2" label="Number 2">
          <input
            type="number"
            className="w-full rounded-md border px-2 py-1"
            value={data.number2}
            onChange={(e) => updateNodeData(id, { number2: e.target.value })}
          />
        </InputHandle>
        <div className="flex justify-between flex-col">
          <OutputHandle id="sum" label="Sum" />
          <OutputHandle id="diff" label="Difference" />
        </div>
      </div>
    </NodeCard>
  )
} 