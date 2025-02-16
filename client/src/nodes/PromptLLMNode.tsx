import {
  Edge,
  Handle,
  HandleProps,
  Node,
  NodeProps,
  Position,
  useEdges,
} from "@xyflow/react";
import NodeCard from "../components/NodeCard";
import { Badge } from "../components/ui/badge";
import InputHandle from "../components/InputHandle";
import OutputHandle from "../components/OutputHandle";
import { Textarea } from "../components/ui/textarea";
import useStore from "../store";
import { RxMagicWand } from 'react-icons/rx'

export type IPromptLLMNode = Node<
  {
    systemPrompt: string;
    query: string;
  },
  "promptLLM"
>;

export const promptLLMNodeDefaultData = {
  systemPrompt: "",
  query: "",
};

export const promptLLMNodeMetadata = {
  icon: RxMagicWand,
  title: "Prompt AI",
  description: "Generate response from LLM",
  type: "promptLLM" as const,
}

export default function PromptLLMNode({ id, data }: NodeProps<IPromptLLMNode>) {
  const updateNodeData = useStore((state) => state.updateNodeData);
  const edges = useEdges();
  console.log({ edges });
  function hasEdge(edges: Edge[], id: string) {
    return edges.some((e) => e.targetHandle === id);
  }
  return (
    <NodeCard
      title="Prompt AI"
      description="Ask a language model, with system prompt and your query"
    >
      <div className="w-full transition-all duration-300 flex flex-col gap-2" style={{ borderRadius: 10 }}>
        <OutputHandle label="Output" />
        <InputHandle id="query" label="Query">
          {!hasEdge(edges, "query") && (
            <Textarea
              onChange={(e) => updateNodeData(id, { query: e.target.value })}
              value={data.query}
            />
          )}
        </InputHandle>
        <InputHandle id="systemPrompt" label="System Prompt">
          {!hasEdge(edges, "systemPrompt") && <Textarea
            onChange={(e) =>
              updateNodeData(id, { systemPrompt: e.target.value })
            }
            value={data.systemPrompt}
          />}
        </InputHandle>
      </div>
    </NodeCard>
  );
}
