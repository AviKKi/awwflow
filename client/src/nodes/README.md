# Adding a New Node

## Files Overview

### New Files to Create:
1. `nodes/YourNode.tsx` - Node UI component
2. `nodes/implementation/YourNode.code.ts` - Node implementation logic

### Files to Modify:
1. `nodes/index.tsx`
   - Add node type to AppNode union type
   - Add default values to NodeDefaultValues
   - Add component to NodeTypes

2. `nodes/implementation/index.ts`
   - Import node implementation
   - Add to nodeImplementations object

3. `components/AddNodeButton.tsx`
   - Add node to nodesDetails array

Steps to Add a New Node
-----------------------

### 1\. Create Node Files

*   **UI Component**: `nodes/YourNode.tsx`
*   **Logic Implementation**: `nodes/implementation/YourNode.code.ts`

### 2\. Define the Node Component

In `YourNode.tsx`:

    
    import { Node, NodeProps } from '@xyflow/react'
    import NodeCard from '../components/NodeCard'
    import InputHandle from '../components/InputHandle'
    import OutputHandle from '../components/OutputHandle'
    import useStore from '../store'
    
    export type IYourNode = Node<{
      property1: string
    }, 'yourNodeType'>
    
    export const yourNodeDefaultData = {
      property1: ''
    }
    
    export default function YourNode({ id, data }: NodeProps<IYourNode>) {
      const updateNodeData = useStore((state) => state.updateNodeData)
    
      return (
        <NodeCard title="Your Node">
          <OutputHandle label="Output" />
          <InputHandle id="input1" label="Input 1">
            <input
              value={data.property1}
              onChange={(e) => updateNodeData(id, { property1: e.target.value })}
            />
          </InputHandle>
        </NodeCard>
      )
    }
    

### 3\. Implement Node Logic

In `YourNode.code.ts`:

    
    export default async function func({
      property1
    }: {
      property1: string
    }) {
      // Node logic here
      return property1.toUpperCase() // Example logic
    }
    

### 4\. Register the Node

#### a. Update `nodes/index.tsx`

    
    import YourNode, { IYourNode, yourNodeDefaultData } from './YourNode'
    
    export type AppNode = /* existing types */ | IYourNode
    
    export const NodeDefaultValues = {
      // ... existing defaults
      yourNodeType: yourNodeDefaultData
    }
    
    export const NodeTypes = {
      // ... existing types
      yourNodeType: YourNode
    }
    

#### b. Update `nodes/implementation/index.ts`

    
    import yourNode from './YourNode.code'
    
    const nodeImplementations = {
      // ... existing implementations
      yourNodeType: yourNode
    }
    
    export default nodeImplementations
    

### 5\. Add to UI Menu

In `components/AddNodeButton.tsx`:

    
    import { FiSomeIcon } from 'react-icons/fi'
    
    const nodesDetails = [
      // ... existing nodes
      {
        icon: <FiSomeIcon />,
        title: "Your Node",
        description: "Description of your node",
        type: "yourNodeType"
      }
    ]
    

Best Practices
--------------

*   Use strict TypeScript types.
*   Follow existing UI patterns.
*   Ensure node type strings match across files.
*   Handle errors in node logic.

Example
-------

Refer to `TextReplaceNode` for a complete example.