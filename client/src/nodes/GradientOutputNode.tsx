import { Handle, Node, NodeProps, Position, useHandleConnections } from "@xyflow/react";
import useStore from "../store";

export type IGradientNode = Node<
  {
  },
  "gradientOutput"
>;
export default function GradientOutputNode({ id }: NodeProps<IGradientNode>) {
    const connections = useHandleConnections({ type: 'target', id: 'a' });
    const getGradientColor = useStore(state=>state.getGradientColor)
    return (    
    <div style={{padding: 40, borderRadius: 10, border: '1px solid rgba(0,0,0,0.7)', background: getGradientColor(connections)}}>
      <Handle type="target" id="a" position={Position.Left} />
      <div>Gradient Output</div>
    </div>
  );
}
