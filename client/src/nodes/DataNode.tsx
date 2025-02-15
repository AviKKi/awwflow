import { Node, NodeProps } from '@xyflow/react'
import { useState } from 'react'
import NodeCard from '../components/NodeCard'
import OutputHandle from '../components/OutputHandle'
import useStore from '../store'
import { Switch } from '../components/ui/switch'
import { Button } from '../components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { X } from 'lucide-react'

export type DataType = 'Text' | 'Number' | 'List' | 'Boolean' | 'Collection'

export interface IDataNode extends Node {
  type: 'dataNode'
  data: {
    dataType: DataType
    value: string | number | boolean | any[] | object
  }
}

export const dataNodeDefaultData = {
  dataType: 'Text' as DataType,
  value: ''
}

export default function DataNode({ id, data }: NodeProps<IDataNode>) {
  const updateNodeData = useStore((state) => state.updateNodeData)
  const [listItems, setListItems] = useState<string[]>(
    Array.isArray(data.value) ? data.value : []
  )

  const handleTypeChange = (type: DataType) => {
    let defaultValue: any = ''
    switch (type) {
      case 'Text':
        defaultValue = ''
        break
      case 'Number':
        defaultValue = 0
        break
      case 'Boolean':
        defaultValue = false
        break
      case 'List':
        defaultValue = []
        break
      case 'Collection':
        defaultValue = {}
        break
    }
    updateNodeData(id, { dataType: type, value: defaultValue })
  }

  const handleValueChange = (value: any) => {
    updateNodeData(id, { ...data, value })
  }

  const handleListItemChange = (index: number, value: string) => {
    const newItems = [...listItems]
    newItems[index] = value
    setListItems(newItems)
    handleValueChange(newItems)
  }

  const addListItem = () => {
    setListItems([...listItems, ''])
    handleValueChange([...listItems, ''])
  }

  const removeListItem = (index: number) => {
    const newItems = listItems.filter((_, i) => i !== index)
    setListItems(newItems)
    handleValueChange(newItems)
  }

  const renderValueInput = () => {
    switch (data.dataType) {
      case 'Text':
        return (
          <Textarea
            value={data.value as string}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder="Enter text value"
            className="min-h-[100px]"
          />
        )
      case 'Number':
        return (
          <Input
            type="number"
            value={data.value as number}
            onChange={(e) => handleValueChange(Number(e.target.value))}
            placeholder="Enter number value"
          />
        )
      case 'Boolean':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={data.value as boolean}
              onCheckedChange={handleValueChange}
            />
            <span>{data.value ? 'True' : 'False'}</span>
          </div>
        )
      case 'List':
        return (
          <div className="space-y-2">
            {listItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={item}
                  onChange={(e) => handleListItemChange(index, e.target.value)}
                  placeholder={`Item ${index + 1}`}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeListItem(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addListItem}>
              Add Item
            </Button>
          </div>
        )
      case 'Collection':
        return (
          <Textarea
            value={
              typeof data.value === 'object'
                ? JSON.stringify(data.value, null, 2)
                : data.value as string
            }
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value)
                handleValueChange(parsed)
              } catch {
                handleValueChange(e.target.value)
              }
            }}
            placeholder="Paste JSON here"
            className="min-h-[150px] font-mono"
          />
        )
      default:
        return null
    }
  }

  return (
    <NodeCard title="Data" description='Add variables to your workflow'>
      <div className="space-y-4 p-4">
        <Select
          value={data.dataType}
          onValueChange={(value) => handleTypeChange(value as DataType)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Text">Text</SelectItem>
            <SelectItem value="Number">Number</SelectItem>
            <SelectItem value="List">List</SelectItem>
            <SelectItem value="Boolean">Boolean</SelectItem>
            <SelectItem value="Collection">Collection</SelectItem>
          </SelectContent>
        </Select>
        <div className="mt-2">{renderValueInput()}</div>
      </div>
      <OutputHandle label="Output" />
    </NodeCard>
  )
} 