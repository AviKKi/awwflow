import { Edge } from "@xyflow/react";
import useStore from "../store";
import { AppNode } from "../nodes";
import nodeImplementations from "../nodes/implementation";
import useExecutionStore from "../store/executionStore";

function getStartingNodes(edges: Edge[]): string[] {
  // Create sets to track nodes with incoming and outgoing edges
  const incomingNodes = new Set<string>();
  const outgoingNodes = new Set<string>();

  // Populate the sets based on the edges
  for (const edge of edges) {
    incomingNodes.add(edge.target);
    outgoingNodes.add(edge.source);
  }

  // Find nodes that are in the outgoing set but not in the incoming set
  const result: string[] = [];
  for (const node of outgoingNodes) {
    if (!incomingNodes.has(node)) {
      result.push(node);
    }
  }

  return result;
}

function convertToAdjacencyList(edges: Edge[]): Record<string, string[]> {
  const adjacencyList: Record<string, string[]> = {};

  for (const edge of edges) {
    const { source, target } = edge;

    // If the source node is not in the adjacency list, initialize it
    if (!adjacencyList[source]) {
      adjacencyList[source] = [];
    }

    // Add the target to the source's adjacency list
    adjacencyList[source].push(target);

    // Ensure the target node is also in the adjacency list (even if it has no outgoing edges)
    if (!adjacencyList[target]) {
      adjacencyList[target] = [];
    }
  }

  return adjacencyList;
}

/**
 * Computes a lookup table of incoming edges for each node.
 * @param edges - An array of React Flow edges.
 * @returns A record where the key is the node ID, and the value is the incoming edge object.
 */
function computeIncomingEdgeListLookup(edges: Edge[]): Record<string, Edge[]> {
  const incomingEdgeListLookup: Record<string, Edge[]> = {};

  edges.forEach((edge) => {
    const target = edge.target;

    if (!incomingEdgeListLookup[target]) {
      incomingEdgeListLookup[target] = [];
    }

    incomingEdgeListLookup[target].push(edge);
  });

  return incomingEdgeListLookup;
}

function isPromise<T = any>(obj: unknown): obj is Promise<T> {
  return (
    !!obj &&
    (typeof obj === "object" || typeof obj === "function") &&
    typeof (obj as any).then === "function"
  );
}

export default async function run() {
  const executionStatus = useExecutionStore.getState().status;
  if (executionStatus === "PROCESSING") { // don't double run it
    return;
  }
  useExecutionStore.getState().setStatus('PROCESSING')

  const state = useStore.getState();

  const startingNodes = getStartingNodes(state.edges);
  const adjList = convertToAdjacencyList(state.edges);
  const incomingEdgeListLookup = computeIncomingEdgeListLookup(state.edges);
  let processingQueue = startingNodes;
  const outputDict: Record<string, null | any> = {};
  state.nodes.forEach((node) => {
    outputDict[node.id] = null;
  });
  const nodeLookup = state.nodes.reduce<Record<string, AppNode>>(
    (lookup, node) => {
      lookup[node.id] = node;
      return lookup;
    },
    {}
  );
  while (processingQueue.length !== 0) {
    const currentNodeId = processingQueue.shift();
    if (typeof currentNodeId === "undefined") {
      throw new Error(`processingQueue is empty or has invalid nodeId`);
    }
    const currentNode = nodeLookup[currentNodeId];
    console.log(currentNode.type);
    if (typeof currentNode.type === "undefined") {
      throw new Error(`node type cannot be undefined`);
    }
    // @ts-ignore
    const func = nodeImplementations[currentNode.type];
    // find out all the incoming data for this node
    // @todo order of execution is not specified, we may get null if a previous node was not executed
    const inflowData: Record<string, any> = { ...currentNode.data };
    incomingEdgeListLookup[currentNodeId]?.forEach((edge) => {
      if (!edge.targetHandle) {
        throw new Error("Edges without targetHandle are not supported");
      }
      let sourceOutput = outputDict[edge.source];
      // @todo handle null
      inflowData[edge.targetHandle] = sourceOutput;
    });
    let output = func(inflowData);
    if (isPromise(output)) {
      output = await output;
    }
    outputDict[currentNode.id] = output;
    useExecutionStore.getState().setNodeOutput(currentNodeId, output);
    processingQueue = [...processingQueue, ...adjList[currentNodeId]];
  }
  useExecutionStore.getState().setStatus('DONE')
  console.log(outputDict);
}
