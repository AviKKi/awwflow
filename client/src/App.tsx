import React, { DragEvent, useCallback } from "react";
import { Background, Controls, ReactFlow, useReactFlow, Node, NodeChange } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useShallow } from "zustand/react/shallow";
import useStore from "./store";
import { AppStore } from "./store";
import { NodeTypes } from "./nodes";
import AddNodeButton from "./components/AddNodeButon";
import { useDnD } from "./utils/dragAndDrop";
import RunButton from "./runEngine/RunButton";
import SaveButton from "./components/SaveButton";

const selector = (state: AppStore) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  setNodeParent: state.setNodeParent,
});

export default function App() {
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect,
    setNodeParent 
  } = useStore(useShallow(selector));

  const { screenToFlowPosition, getIntersectingNodes, getNode } = useReactFlow();
  const addNode = useStore(state => state.addNode);
  const [type] = useDnD();

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const dropHandler = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!type) return;

    const position = screenToFlowPosition({
      x: e.clientX,
      y: e.clientY,
    });

    // First create the node
    const newNodeId = addNode(type, position);

    // Get the newly created node
    const newNode = getNode(newNodeId);
    if (!newNode) return;

    // Check if it intersects with any RuleGate nodes
    const intersectingRuleGates = getIntersectingNodes(newNode)
      .filter(node => node.type === 'ruleGateNode');

    // If it intersects with a RuleGate, make it a child
    if (intersectingRuleGates.length > 0) {
      const ruleGate = intersectingRuleGates[0];
      setNodeParent(newNodeId, ruleGate.id, ruleGate.position);
    }
  };

  const onNodeDrag = useCallback((event: React.MouseEvent, node: Node) => {
    // Get all RuleGate nodes that this node intersects with
    const intersectingRuleGates = getIntersectingNodes(node)
      .filter(n => n.type === 'ruleGateNode');

    // Highlight the first intersecting RuleGate
    nodes.forEach(n => {
      if (n.type === 'ruleGateNode') {
        const isIntersecting = intersectingRuleGates[0]?.id === n.id;
        const change: NodeChange = {
          id: n.id,
          type: 'select',
          selected: isIntersecting,
        };
        onNodesChange([change]);
      }
    });
  }, [getIntersectingNodes, nodes, onNodesChange]);

  const onNodeDragStop = useCallback((event: React.MouseEvent, node: Node) => {
    // Clear all highlights
    nodes.forEach(n => {
      if (n.type === 'ruleGateNode') {
        const change: NodeChange = {
          id: n.id,
          type: 'select',
          selected: false
        };
        onNodesChange([change]);
      }
    });

    // Get all RuleGate nodes that this node intersects with
    const intersectingRuleGates = getIntersectingNodes(node)
      .filter(n => n.type === 'ruleGateNode');

    // If we have an intersection, make the node a child of the first RuleGate
    if (intersectingRuleGates.length > 0) {
      const ruleGate = intersectingRuleGates[0];
      setNodeParent(node.id, ruleGate.id, ruleGate.position);
    }
  }, [getIntersectingNodes, nodes, onNodesChange, setNodeParent]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <AddNodeButton />
      <SaveButton />
      <ReactFlow
        nodeTypes={NodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={dropHandler}
        onDragOver={handleDragOver}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        selectNodesOnDrag={false}
      >
        <Controls />
        <Background />
      </ReactFlow>
      <RunButton />
    </div>
  );
}
