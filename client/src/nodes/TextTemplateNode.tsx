import { Node, NodeProps } from '@xyflow/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import NodeCard from '../components/NodeCard'
import InputHandle from '../components/InputHandle'
import OutputHandle from '../components/OutputHandle'
import useStore from '../store'
import { Plus, Minus } from 'lucide-react'

export type ITextTemplateNode = Node<{
  template: string
  textInputs: Record<string, string>
  inputCount: number
}, 'textTemplate'>

export const textTemplateNodeDefaultData = {
  template: '',
  textInputs: { text1: '' },
  inputCount: 1
}

export default function TextTemplateNode({ id, data }: NodeProps<ITextTemplateNode>) {
  const updateNodeData = useStore((state) => state.updateNodeData)

  const handleAddInput = () => {
    const newCount = data.inputCount + 1
    const newTextInputs = {
      ...data.textInputs,
      [`text${newCount}`]: ''
    }
    updateNodeData(id, {
      textInputs: newTextInputs,
      inputCount: newCount
    })
  }

  const handleRemoveInput = () => {
    if (data.inputCount <= 1) return
    const newCount = data.inputCount - 1
    const newTextInputs = { ...data.textInputs }
    delete newTextInputs[`text${data.inputCount}`]
    updateNodeData(id, {
      textInputs: newTextInputs,
      inputCount: newCount
    })
  }

  const handleTextInputChange = (key: string, value: string) => {
    updateNodeData(id, {
      textInputs: {
        ...data.textInputs,
        [key]: value
      }
    })
  }

  return (
    <NodeCard 
      title="Text Template" 
      description="Replace template variables with input text"
    >
      <div className="flex flex-col gap-2 p-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRemoveInput}
            disabled={data.inputCount <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleAddInput}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <Textarea
          placeholder="Enter template with $text1, $text2, etc."
          value={data.template}
          onChange={(e) => updateNodeData(id, { template: e.target.value })}
          className="min-h-[100px]"
        />

        {Array.from({ length: data.inputCount }).map((_, index) => {
          const key = `text${index + 1}`
          return (
            <InputHandle
              key={key}
              id={key}
              label={`Text ${index + 1}`}
              dataPath={`textInputs.${key}`}
            >
              <Input
                value={data.textInputs[key] || ''}
                onChange={(e) => handleTextInputChange(key, e.target.value)}
                placeholder={`Enter ${key}`}
              />
            </InputHandle>
          )
        })}

        <OutputHandle label="Output" />
      </div>
    </NodeCard>
  )
} 