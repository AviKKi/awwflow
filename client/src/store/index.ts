import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Edge,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
} from "@xyflow/react";
import { HandleConnection } from "@xyflow/system";
import { create } from "zustand";
import { AppNode, NodeDefaultValues } from "../nodes";


export interface AppStore {
  idCounter: number
  nodes: AppNode[];
  edges: Edge[];
  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: AppNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  updateNodeColor: (id: string, color: string) => void;
  getGradientColor: (connections: HandleConnection[]) => string;
  addNode: (type: string, position: {x: number, y: number}) => void;
  updateNodeData: (nodeId: string, data: Record<string, any>) => void;
  /** convert the graph into json */
  dump: () => {nodes: AppNode[], edges: Edge[], idCounter: number};
  /** load graph from json string */
  load: (data: string) => void;
}


const initialNodes: AppNode[] = [
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
    position: {x: 350, y: 500},
    type: "promptLLM"
  }
];
const initialEdges: Edge[] = [];

const useStore = create<AppStore>((set, get) => ({
  idCounter: 10,
  nodes: initialNodes,
  edges: initialEdges,
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
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
    const newNodes: AppNode[] = get().nodes.map((nd) => {
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
    // @ts-ignore
    const newNodes: AppNode[] = get().nodes.map(nd => {
      if(nd.id!==nodeId){
        return {...nd}
      }
      const allKeysMatch = Array.from(Object.keys(data)).every(key => {
        // eslint-disable-next-line no-prototype-builtins
        return nd.data.hasOwnProperty(key)
      })
      if(!allKeysMatch){
        throw new Error(`type of object ${data} cannot be assigned to node ${nd}, id ${nodeId}`)
      }
      return { ...nd, data: {...nd.data, ...data} }
    })
    set({nodes: newNodes})
  },
  getGradientColor: (connections: HandleConnection[]) => {
    const colors: string[] = [];
    const nodes = get().nodes;
    connections.forEach((conn) => {
      const sourceId = conn.source;
      const source = nodes.find((nd) => nd.id === sourceId);
      if (source && source.type === "colorInput") {
        colors.push(source.data.color);
      }
    });
    return `linear-gradient(0deg, ${colors.join(", ")})`;
  },
  // @ts-ignore
  addNode(type: AppNode['type'], position: { x: number; y: number }) {
    if(!type){
      return ;
    }
    let { idCounter, nodes } = get();
    // @ts-ignore
    const defaultData = NodeDefaultValues[type]
    idCounter += 1
    nodes = [
      ...nodes,
      {
        id: String(idCounter),
        position: position,
        data: defaultData,
        type,
      },
    ];
    console.log(nodes)
    set({idCounter, nodes})
  },
  dump(){
    const {edges, nodes, idCounter} = get()
    return {edges, nodes, idCounter}
  },
  load(data: string){
    const parsed = JSON.parse(data)
    if(!parsed.idCounter || !parsed.edges || !parsed.nodes){
      throw new Error("Invalid JSON, can't load from this")
    }
    set({
      ...parsed
    })
  }
}));


export default useStore;
