import { Handle, Position } from "@xyflow/react";
import { Label } from "./ui/label";

export interface OutHandleProps {
  label: string;
  /** if output of the node is an object,
   * path of the property in output object of this node
   * ex: if node outputs, {filename: string, content: string}
   * there will be two OutHandle, fist called filename second called content
   */
  id?: string;
}

export default function OutHandle(props: OutHandleProps) {
  return (
    <div className="relative w-full justify-end flex py-2">
      <Label>{props.label}</Label>
      <Handle id={props.id} type="source" position={Position.Right} className="!-right-4" />
    </div>
  );
}
