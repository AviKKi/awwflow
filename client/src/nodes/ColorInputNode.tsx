import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import useStore from "../store";

export type IColorInputNode = Node<
  {
    color: string;
  },
  "colorInput"
>;
export default function ColorInputNode({
  id,
  data,
}: NodeProps<IColorInputNode>) {
  const updateNodeColor = useStore((state) => state.updateNodeColor);
  
  return (
    <div style={{ backgroundColor: data.color, borderRadius: 10, padding: 20 }}>
      <input
        type="color"
        value={data.color}
        onChange={(e) => updateNodeColor(id, e.target.value)}
      />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
