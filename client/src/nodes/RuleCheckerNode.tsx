import { Node, NodeProps } from '@xyflow/react'
import { useState } from 'react'
import NodeCard from '../components/NodeCard'
import InputHandle from '../components/InputHandle'
import OutputHandle from '../components/OutputHandle'
import useStore from '../store'
import { Button } from '../components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import { Input } from '../components/ui/input'
import { X, Plus } from 'lucide-react'
import { FiCheckCircle } from 'react-icons/fi'

export type DataType = 'Text' | 'Number' | 'List' | 'Collection'

interface InputConfig {
  id: string
  dataType: DataType
}

type TextOperator = 
  | 'isEqualTo' 
  | 'isNotEqualTo' 
  | 'contains' 
  | 'doesNotContain'
  | 'startsWith'
  | 'endsWith'
  | 'isEmpty'
  | 'isNotEmpty'

type NumberOperator = 
  | 'isEqualTo'
  | 'isNotEqualTo'
  | 'isGreaterThan'
  | 'isLessThan'
  | 'isGreaterThanOrEqualTo'
  | 'isLessThanOrEqualTo'

type ListOperator = 
  | 'hasLength'
  | 'isEmpty'
  | 'isNotEmpty'
  | 'contains'
  | 'doesNotContain'

type ObjectOperator = 
  | 'hasKey'
  | 'doesNotHaveKey'
  | 'hasValueForKey'
  | 'doesNotHaveValueForKey'

type Operator = TextOperator | NumberOperator | ListOperator | ObjectOperator

interface Condition {
  id: string
  leftId: string
  operator: Operator
  rightId: string
}

export type IRuleCheckerNode = Node<
  {
    inputs: InputConfig[]
    conditions: Condition[]
  },
  "ruleCheckerNode"
>

export const ruleCheckerNodeDefaultData = {
  inputs: [{ id: 'input1', dataType: 'Text' as DataType }],
  conditions: []
}

export const ruleCheckerNodeMetadata = {
  icon: FiCheckCircle,
  title: "Rule Checker",
  description: "Define and validate rules for your data",
  type: "ruleCheckerNode" as const,
}

const operatorsByType: Record<DataType, { value: Operator; label: string }[]> = {
  Text: [
    { value: 'isEqualTo', label: 'is equal to' },
    { value: 'isNotEqualTo', label: 'is not equal to' },
    { value: 'contains', label: 'contains' },
    { value: 'doesNotContain', label: 'does not contain' },
    { value: 'startsWith', label: 'starts with' },
    { value: 'endsWith', label: 'ends with' },
    { value: 'isEmpty', label: 'is empty' },
    { value: 'isNotEmpty', label: 'is not empty' }
  ],
  Number: [
    { value: 'isEqualTo', label: 'is equal to' },
    { value: 'isNotEqualTo', label: 'is not equal to' },
    { value: 'isGreaterThan', label: 'is greater than' },
    { value: 'isLessThan', label: 'is less than' },
    { value: 'isGreaterThanOrEqualTo', label: 'is greater than or equal to' },
    { value: 'isLessThanOrEqualTo', label: 'is less than or equal to' }
  ],
  List: [
    { value: 'hasLength', label: 'has length' },
    { value: 'isEmpty', label: 'is empty' },
    { value: 'isNotEmpty', label: 'is not empty' },
    { value: 'contains', label: 'contains' },
    { value: 'doesNotContain', label: 'does not contain' }
  ],
  Collection: [
    { value: 'hasKey', label: 'has key' },
    { value: 'doesNotHaveKey', label: 'does not have key' },
    { value: 'hasValueForKey', label: 'has value for key' },
    { value: 'doesNotHaveValueForKey', label: 'does not have value for key' }
  ]
}

export default function RuleCheckerNode({ id, data }: NodeProps<IRuleCheckerNode>) {
  const updateNodeData = useStore((state) => state.updateNodeData)

  const addInput = () => {
    const newInputs = [
      ...data.inputs,
      {
        id: `input${data.inputs.length + 1}`,
        dataType: 'Text' as DataType
      }
    ]
    updateNodeData(id, { ...data, inputs: newInputs })
  }

  const removeInput = (inputId: string) => {
    const newInputs = data.inputs.filter(input => input.id !== inputId)
    // Also remove conditions that use this input
    const newConditions = data.conditions.filter(condition => condition.leftId !== inputId && condition.rightId !== inputId)
    updateNodeData(id, { inputs: newInputs, conditions: newConditions })
  }

  const updateInputType = (inputId: string, dataType: DataType) => {
    const newInputs = data.inputs.map(input =>
      input.id === inputId ? { ...input, dataType } : input
    )
    // Remove conditions for this input as the type has changed
    const newConditions = data.conditions.filter(condition => condition.leftId !== inputId && condition.rightId !== inputId)
    updateNodeData(id, { inputs: newInputs, conditions: newConditions })
  }

  const addCondition = () => {
    if (data.inputs.length === 0) return

    const newCondition: Condition = {
      id: `condition${data.conditions.length + 1}`,
      leftId: data.inputs[0].id,
      operator: operatorsByType[data.inputs[0].dataType][0].value,
      rightId: data.inputs[0].id
    }
    updateNodeData(id, { 
      ...data, 
      conditions: [...data.conditions, newCondition] 
    })
  }

  const removeCondition = (conditionId: string) => {
    const newConditions = data.conditions.filter(condition => condition.id !== conditionId)
    updateNodeData(id, { ...data, conditions: newConditions })
  }

  const updateCondition = (conditionId: string, updates: Partial<Condition>) => {
    const newConditions = data.conditions.map(condition =>
      condition.id === conditionId ? { ...condition, ...updates } : condition
    )
    updateNodeData(id, { ...data, conditions: newConditions })
  }

  const getInputDataType = (inputId: string): DataType => {
    return data.inputs.find(input => input.id === inputId)?.dataType || 'Text'
  }

  const shouldShowValueInput = (operator: Operator): boolean => {
    return !['isEmpty', 'isNotEmpty'].includes(operator)
  }

  const getValueInput = (condition: Condition) => {
    if (!shouldShowValueInput(condition.operator)) return null

    return (
      <Select
        value={condition.rightId}
        onValueChange={(value) => updateCondition(condition.id, { rightId: value })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select input" />
        </SelectTrigger>
        <SelectContent>
          {data.inputs.map((input) => (
            <SelectItem key={input.id} value={input.id}>
              Data {input.id.replace('input', '')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  return (
    <NodeCard title="Rule Checker" description="Define rules based on input data">
      <div className="space-y-4 p-4">
        {/* Input Handles Section */}
        {data.inputs.map((input) => (
          <div key={input.id} className="flex items-center space-x-2">
            <InputHandle id={input.id} label={`Data ${input.id.replace('input', '')}`}>
              <div className="flex-1">
                <Select
                  value={input.dataType}
                  onValueChange={(value) => updateInputType(input.id, value as DataType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Text">Text</SelectItem>
                    <SelectItem value="Number">Number</SelectItem>
                    <SelectItem value="List">List</SelectItem>
                    <SelectItem value="Collection">Collection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </InputHandle>
            {data.inputs.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeInput(input.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addInput}>
          Add Input
        </Button>

        {/* Conditions Section */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Conditions</h3>
            <Button variant="outline" size="sm" onClick={addCondition}>
              <Plus className="h-4 w-4 mr-2" />
              Add Condition
            </Button>
          </div>
          {data.conditions.map((condition) => {
            const inputDataType = getInputDataType(condition.leftId)
            const operators = operatorsByType[inputDataType]

            return (
              <div key={condition.id} className="space-y-2 p-2 border rounded-md">
                <div className="flex items-center space-x-2">
                  {/* Left Input Selection */}
                  <Select
                    value={condition.leftId}
                    onValueChange={(value) => updateCondition(condition.id, { leftId: value })}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select input" />
                    </SelectTrigger>
                    <SelectContent>
                      {data.inputs.map((input) => (
                        <SelectItem key={input.id} value={input.id}>
                          Data {input.id.replace('input', '')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Operator Selection */}
                  <Select
                    value={condition.operator}
                    onValueChange={(value) => updateCondition(condition.id, { operator: value as Operator })}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select operator" />
                    </SelectTrigger>
                    <SelectContent>
                      {operators.map((op) => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Right Input Selection */}
                  {getValueInput(condition)}

                  {/* Remove Condition Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCondition(condition.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <OutputHandle label="Result" />
    </NodeCard>
  )
} 