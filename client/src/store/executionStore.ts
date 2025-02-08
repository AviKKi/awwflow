import { create } from 'zustand';


interface ExecutionStore {
  status: "DONE" | "PROCESSING" | "IDLE";
  nodeOutputs: Record<string, null | string | string[]>;
  graphOutputs: Record<string, { name: string; output: null | string }>;
  processingNodeId: null | string;

  // Actions
  setStatus: (status: "DONE" | "PROCESSING" | "IDLE") => void;
  setNodeOutput: (nodeId: string, output: null | string | string[]) => void;
  setGraphOutput: (nodeId: string, name: string, output: null | string) => void;
  setProcessingNodeId: (nodeId: null | string) => void;
  reset: () => void;
}

const useExecutionStore = create<ExecutionStore>((set) => ({
  // Initial state
  status: "IDLE",
  nodeOutputs: {},
  graphOutputs: {},
  processingNodeId: null,

  // Actions
  setStatus: (status) => set({ status }),
  setNodeOutput: (nodeId, output) =>
    set((state) => ({
      nodeOutputs: { ...state.nodeOutputs, [nodeId]: output },
    })),
  setGraphOutput: (nodeId, name, output) =>
    set((state) => ({
      graphOutputs: {
        ...state.graphOutputs,
        [nodeId]: { name, output },
      },
    })),
  setProcessingNodeId: (nodeId) => set({ processingNodeId: nodeId }),
  reset: () =>
    set({
      status: "IDLE",
      nodeOutputs: {},
      graphOutputs: {},
      processingNodeId: null,
    }),
}));

export default useExecutionStore;
