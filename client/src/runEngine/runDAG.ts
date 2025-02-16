import { Edge } from '@xyflow/react'
import useStore from '../store'
import { AppNode } from '../nodes'
import nodeImplementations from '../nodes/implementation'
import useExecutionStore from '../store/executionStore'

interface NodeExecutionContext {
  nodeLookup: Record<string, AppNode>
  outputDict: Record<string, any>
  incomingEdgeListLookup: Record<string, Edge[]>
  skippedNodes: Set<string>
}

interface NodeDependencyInfo {
  ruleGateParentId?: string
  edges: Edge[]
}

class CycleDetectionError extends Error {
  constructor(cycle: string[]) {
    super(`Cycle detected in workflow: ${cycle.join(' -> ')}`)
    this.name = 'CycleDetectionError'
  }
}

function buildDependencyInfo(nodes: AppNode[], edges: Edge[]): Record<string, NodeDependencyInfo> {
  const dependencyInfo: Record<string, NodeDependencyInfo> = {}
  
  // Initialize dependency info for all nodes
  nodes.forEach(node => {
    dependencyInfo[node.id] = {
      edges: [],
      ruleGateParentId: node.parentId && 
        nodes.find(n => n.id === node.parentId)?.type === 'ruleGateNode' 
        ? node.parentId 
        : undefined
    }
  })

  // Add edge dependencies
  edges.forEach(edge => {
    if (dependencyInfo[edge.target]) {
      dependencyInfo[edge.target].edges.push(edge)
    }
  })

  return dependencyInfo
}

function detectCycle(edges: Edge[]): string[] | null {
  const graph: Record<string, string[]> = {}
  
  // Build adjacency list
  edges.forEach(({ source, target }) => {
    if (!graph[source]) graph[source] = []
    if (!graph[target]) graph[target] = []
    graph[source].push(target)
  })

  const visited = new Set<string>()
  const recursionStack = new Set<string>()
  const cycleNodes: string[] = []

  function dfs(node: string): boolean {
    visited.add(node)
    recursionStack.add(node)

    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) {
          cycleNodes.unshift(neighbor)
          return true
        }
      } else if (recursionStack.has(neighbor)) {
        cycleNodes.unshift(neighbor)
        return true
      }
    }

    recursionStack.delete(node)
    return false
  }

  for (const node of Object.keys(graph)) {
    if (!visited.has(node)) {
      if (dfs(node)) {
        cycleNodes.unshift(node)
        return cycleNodes
      }
    }
  }

  return null
}

function topologicalSort(nodes: AppNode[], edges: Edge[]): string[] {
  const graph: Record<string, string[]> = {}
  const inDegree: Record<string, number> = {}
  const dependencyInfo = buildDependencyInfo(nodes, edges)
  
  // Initialize graph and in-degree count
  edges.forEach(({ source, target }) => {
    if (!graph[source]) graph[source] = []
    graph[source].push(target)
    
    if (!inDegree[source]) inDegree[source] = 0
    inDegree[target] = (inDegree[target] || 0) + 1
  })

  // Add implicit dependencies from rule gate nodes to their children
  nodes.forEach(node => {
    const ruleGateParentId = dependencyInfo[node.id].ruleGateParentId
    if (ruleGateParentId) {
      if (!graph[ruleGateParentId]) graph[ruleGateParentId] = []
      if (!graph[node.id]) graph[node.id] = []
      
      // Add implicit edge from rule gate to child if not already present
      if (!graph[ruleGateParentId].includes(node.id)) {
        graph[ruleGateParentId].push(node.id)
        inDegree[node.id] = (inDegree[node.id] || 0) + 1
      }
    }
  })

  // Find nodes with no incoming edges
  const queue: string[] = Object.keys(graph).filter(node => !inDegree[node] || inDegree[node] === 0)
  const result: string[] = []

  while (queue.length) {
    const node = queue.shift()!
    result.push(node)

    for (const neighbor of graph[node] || []) {
      inDegree[neighbor]--
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor)
      }
    }
  }

  return result
}

function computeIncomingEdgeListLookup(edges: Edge[]): Record<string, Edge[]> {
  const lookup: Record<string, Edge[]> = {}
  edges.forEach(edge => {
    if (!lookup[edge.target]) lookup[edge.target] = []
    lookup[edge.target].push(edge)
  })
  return lookup
}

function isPromise<T = any>(obj: unknown): obj is Promise<T> {
  return (
    !!obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    typeof (obj as any).then === 'function'
  )
}

function setNestedValue(obj: Record<string, any>, path: string, value: any): void {
  const pathParts = path.split('.')
  let current = obj
  for (let i = 0; i < pathParts.length - 1; i++) {
    if (!current[pathParts[i]]) current[pathParts[i]] = {}
    current = current[pathParts[i]]
  }
  current[pathParts[pathParts.length - 1]] = value
}

async function executeNode(
  nodeId: string,
  context: NodeExecutionContext
): Promise<void> {
  const { nodeLookup, outputDict, incomingEdgeListLookup, skippedNodes } = context
  const currentNode = nodeLookup[nodeId]

  // Skip execution if node is marked as skipped
  if (skippedNodes.has(nodeId)) {
    console.log(`Skipping node ${nodeId} as it depends on a failed rule gate or was marked for skip`)
    return
  }

  if (!currentNode?.type) {
    throw new Error(`Invalid node or missing type for node ${nodeId}`)
  }

  // @ts-ignore - we know the implementation exists based on the type
  const func = nodeImplementations[currentNode.type]
  const inflowData: Record<string, any> = { ...currentNode.data }

  // Process incoming edges and set input data
  incomingEdgeListLookup[nodeId]?.forEach(edge => {
    if (!edge.targetHandle) {
      throw new Error('Edges without targetHandle are not supported')
    }

    const sourceOutput = outputDict[edge.source]
    const dataPath = (edge.data as any)?.path
    debugger;
    if (dataPath) {
      setNestedValue(inflowData, dataPath, sourceOutput)
    } else {
      inflowData[edge.targetHandle] = sourceOutput
    }
  })

  let output = func(inflowData)
  if (isPromise(output)) {
    output = await output
  }

  outputDict[nodeId] = output
  useExecutionStore.getState().setNodeOutput(nodeId, output)

  // If this is a rule gate node and its output is false,
  // mark all child nodes to be skipped
  if (currentNode.type === 'ruleGateNode' && output === false) {
    const childNodes = Object.values(nodeLookup)
      .filter(node => node.parentId === currentNode.id)
      .map(node => node.id)
    
    childNodes.forEach(childId => {
      skippedNodes.add(childId)
      // Also skip any nodes that depend on this child through edges
      const dependentNodes = findDependentNodes(childId, incomingEdgeListLookup)
      dependentNodes.forEach(depId => skippedNodes.add(depId))
    })
  }
}

function findDependentNodes(nodeId: string, edgeLookup: Record<string, Edge[]>): string[] {
  const dependent: Set<string> = new Set()
  
  function addDependents(id: string) {
    Object.entries(edgeLookup).forEach(([targetId, edges]) => {
      if (edges.some(edge => edge.source === id)) {
        dependent.add(targetId)
        addDependents(targetId)
      }
    })
  }
  
  addDependents(nodeId)
  return Array.from(dependent)
}

export default async function runDAG(): Promise<void> {
  const executionStatus = useExecutionStore.getState().status
  if (executionStatus === 'PROCESSING') {
    return
  }
  
  useExecutionStore.getState().setStatus('PROCESSING')
  
  try {
    const state = useStore.getState()
    const { nodes, edges } = state

    // Check for cycles
    const cycle = detectCycle(edges)
    if (cycle) {
      throw new CycleDetectionError(cycle)
    }

    // Get execution order through topological sort
    const executionOrder = topologicalSort(nodes as AppNode[], edges)

    // Prepare execution context
    const context: NodeExecutionContext = {
      nodeLookup: nodes.reduce<Record<string, AppNode>>((acc, node) => {
        acc[node.id] = node as AppNode
        return acc
      }, {}),
      outputDict: {},
      incomingEdgeListLookup: computeIncomingEdgeListLookup(edges),
      skippedNodes: new Set()
    }

    // Execute nodes in order
    for (const nodeId of executionOrder) {
      await executeNode(nodeId, context)
    }

    useExecutionStore.getState().setStatus('DONE')
    console.log('Execution completed:', context.outputDict)
  } catch (error) {
    useExecutionStore.getState().setStatus('IDLE')
    console.error('Execution failed:', error)
    throw error
  }
} 