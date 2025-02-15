import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Edge,
  Node,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  XYPosition,
} from "@xyflow/react";
import { HandleConnection } from "@xyflow/system";
import { create } from "zustand";
import { AppNode, NodeDefaultValues } from "../nodes";

const PARENT_TOP_PADDING = 200
const CHILD_VERTICAL_GAP = 10
const PARENT_MIN_WIDTH = 400
const PARENT_PADDING = 50

const getNodeDimensions = (nodeId: string) => {
  const nodeElement = document.querySelector(`[data-id="${nodeId}"]`)
  if (!nodeElement) {
    return { width: 0, height: 0 }
  }
  const rect = nodeElement.getBoundingClientRect()
  return { width: rect.width, height: rect.height }
}

type NodeWithParent = Node & {
  parentId?: string;
  extent?: 'parent';
  data: Record<string, any>;
}

export interface AppStore {
  idCounter: number;
  nodes: NodeWithParent[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: NodeWithParent[]) => void;
  setEdges: (edges: Edge[]) => void;
  updateNodeColor: (id: string, color: string) => void;
  getGradientColor: (connections: HandleConnection[]) => string;
  addNode: (type: string, position: XYPosition) => string;
  updateNodeData: (nodeId: string, data: Record<string, any>) => void;
  /** convert the graph into json */
  dump: () => { nodes: NodeWithParent[], edges: Edge[], idCounter: number };
  /** load graph from json string */
  load: (data: string) => void;
  /** Check if a node is a parent node */
  isParentNode: (nodeType: string) => boolean;
  /** Get all child nodes of a parent */
  getChildNodes: (parentId: string) => NodeWithParent[];
  /** Update parent node dimensions based on children */
  updateParentDimensions: (parentId: string) => void;
  /** Make a node a child of a parent node */
  setNodeParent: (nodeId: string, parentId: string, parentPosition: XYPosition) => void;
}

let initialNodes: NodeWithParent[] = [
  {
    id: "1",
    position: { x: 300, y: 200 },
    data: { defaultValue: "", inputName: "" },
    type: "input",
  },
  {
    id: "2",
    position: { x: 600, y: 200 },
    data: { defaultValue: "", inputName: "" },
    type: "input",
  },
  {
    id: "6",
    data: {
      systemPrompt: "",
      query: ""
    },
    position: { x: 350, y: 500 },
    type: "promptLLM"
  }
];


const initialEdges: Edge[] = [];

const useStore = create<AppStore>((set, get) => ({
  idCounter: 10,
  nodes: initialNodes,
  edges: initialEdges,
  onNodesChange: (changes) => {
    const allNodes = get().nodes;
    const removedNodeParents = changes.filter(change => change.type === 'remove').map(
      change => allNodes.find(node => node.id === change.id)
    ).map(
      node => node?.parentId
    ).filter(x => x !== undefined)


    set({
      nodes: applyNodeChanges(changes, get().nodes) as NodeWithParent[],
    });
    removedNodeParents.forEach(id => get().updateParentDimensions(id))
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection) => {
    // Get the target handle element to read the data-path attribute
    const targetHandle = document.querySelector(
      `[data-handleid="${connection.targetHandle}"][data-nodeid="${connection.target}"]`
    )
    const dataPath = targetHandle?.getAttribute('data-path')

    set({
      edges: addEdge(
        {
          ...connection,
          data: dataPath ? { path: dataPath } : undefined
        },
        get().edges
      ),
    });
  },
  setNodes: (nodes) => {
    set({ nodes });
  },
  setEdges: (edges) => {
    set({ edges });
  },
  updateNodeColor: (nodeId: string, color: string) => {
    const newNodes = get().nodes.map((nd) => {
      if (nd.id !== nodeId) {
        return { ...nd };
      }
      if (nd.type === "colorInput") {
        return { ...nd, data: { color } };
      }
      throw new Error(`${nodeId} should have type 'colorInput'`);
    });
    set({ nodes: newNodes });
  },
  updateNodeData: (nodeId: string, data: Record<string, any>) => {
    const newNodes = get().nodes.map(nd => {
      if (nd.id !== nodeId) {
        return { ...nd }
      }
      const allKeysMatch = Array.from(Object.keys(data)).every(key => {
        return nd.data.hasOwnProperty(key)
      })
      if (!allKeysMatch) {
        throw new Error(`type of object ${data} cannot be assigned to node ${nd}, id ${nodeId}`)
      }
      return { ...nd, data: { ...nd.data, ...data } }
    })
    set({ nodes: newNodes })
  },
  getGradientColor: (connections: HandleConnection[]) => {
    const colors: string[] = [];
    const nodes = get().nodes;
    connections.forEach((conn) => {
      const sourceId = conn.source;
      const source = nodes.find((nd) => nd.id === sourceId);
      if (source?.type === "colorInput" && source.data.color) {
        colors.push(source.data.color);
      }
    });
    return `linear-gradient(0deg, ${colors.join(", ")})`;
  },
  isParentNode: (nodeType: string) => {
    return nodeType === 'ruleGateNode'
  },
  getChildNodes: (parentId: string) => {
    return get().nodes.filter(node => node.parentId === parentId)
  },
  updateParentDimensions: (parentId: string) => {
    const parent = get().nodes.find(node => node.id === parentId)
    if (!parent || !get().isParentNode(parent.type || '')) return

    const children = get().getChildNodes(parentId)
    if (children.length === 0) return

    // Calculate max width and total height of children
    let maxChildWidth = 0
    let totalChildrenHeight = 0

    children.forEach(child => {
      const { width, height } = getNodeDimensions(child.id)
      maxChildWidth = Math.max(maxChildWidth, width)
      totalChildrenHeight += height
    })

    // Calculate final dimensions
    const width = maxChildWidth + (PARENT_PADDING * 2)
    const height = PARENT_TOP_PADDING +
      (children.length - 1) * CHILD_VERTICAL_GAP +
      totalChildrenHeight

    // Update parent dimensions
    const newNodes = get().nodes.map(node => {
      if (node.id === parentId) {
        return {
          ...node,
          data: {
            ...node.data,
            width: Math.max(width, PARENT_MIN_WIDTH),
            height: Math.max(height, PARENT_MIN_WIDTH)
          }
        }
      }
      return node
    })

    set({ nodes: newNodes })
  },
  addNode(type: string, position: XYPosition) {
    if (!type) return ''

    let { idCounter, nodes } = get()
    const defaultData = NodeDefaultValues[type as keyof typeof NodeDefaultValues]
    idCounter += 1

    const newNode: NodeWithParent = {
      id: String(idCounter),
      position,
      data: defaultData,
      type,
      draggable: true,
      zIndex: type === 'notesNode' ? -1 : undefined
    }

    // Keep parent nodes at the top of the array
    if (get().isParentNode(type)) {
      nodes = [newNode, ...nodes]
    } else {
      nodes = [...nodes, newNode]
    }

    set({ idCounter, nodes })
    return String(idCounter)
  },
  setNodeParent(nodeId: string, parentId: string, parentPosition: XYPosition) {
    // Get existing children to calculate new child's position
    const existingChildren = get().nodes.filter(node => node.parentId === parentId)

    // Get the actual dimensions of the node being added
    const { width: nodeWidth, height: nodeHeight } = getNodeDimensions(nodeId)

    // Calculate total height of existing children including gaps
    let totalChildrenHeight = 0
    existingChildren.forEach(child => {
      const { height } = getNodeDimensions(child.id)
      totalChildrenHeight += height + CHILD_VERTICAL_GAP
    })
    const { width: parentWidth } = getNodeDimensions(parentId)
    // Calculate vertical position based on existing children
    const childYPosition = PARENT_TOP_PADDING + totalChildrenHeight

    // Center horizontally in parent
    const childXPosition = (parentWidth - nodeWidth) / 2

    const nodes = get().nodes.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          parentId,
          extent: 'parent' as const,
          draggable: false,
          position: {
            x: childXPosition,
            y: childYPosition
          }
        }
      }
      return node
    })

    set({ nodes })
    get().updateParentDimensions(parentId)
  },
  dump() {
    const { edges, nodes, idCounter } = get()
    return { edges, nodes, idCounter }
  },
  load(data: string) {
    const parsed = JSON.parse(data)
    if (!parsed.idCounter || !parsed.edges || !parsed.nodes) {
      throw new Error("Invalid JSON, can't load from this")
    }
    set({
      ...parsed
    })
  }
}));


export default useStore;
