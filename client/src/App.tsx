import React, { DragEvent, DragEventHandler, useCallback } from "react";
import { Background, Controls, ReactFlow, useReactFlow } from "@xyflow/react";

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
});

export default function App() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore(
    useShallow(selector)
  );
  const { screenToFlowPosition } = useReactFlow();
  const addNode = useStore(state => state.addNode);
  const [type] = useDnD();
  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);
  const dropHandler = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // check if the dropped element is valid
    if (!type) {
      return;
    }
    const position = screenToFlowPosition({
      x: e.clientX,
      y: e.clientY,
    });
    addNode(type, position);
  };
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
      >
        <Controls />
        <Background />
      </ReactFlow>
      <RunButton />
    </div>
  );
}
