import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import useStore from "../store";
import { Input } from "../components/ui/input";
import NodeCard from "../components/NodeCard";
import InputHandle from "@/components/InputHandle";

export type IOutputNode = Node<
  {
    outputName: string;
  },
  "output"
>;

export const outputNodeDefaultData: IOutputNode["data"] = {
  outputName: "",
};

export default function OutputNode({ id, data }: NodeProps<IOutputNode>) {
  const updateNodeData = useStore((state) => state.updateNodeData);
  return (
    <NodeCard title="Output" description="Output of your workflow">
        <InputHandle id="outputValue" label="" />

      <div style={{ borderRadius: 10 }} className="w-full">
        <Input
          placeholder="this will be useful when you want multiple outputs"
          type="text"
          value={data.outputName}
          onChange={(e) => updateNodeData(id, { outputName: e.target.value })}
        />
      </div>
    </NodeCard>
  );
}
