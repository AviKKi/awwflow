import { Handle, Position } from "@xyflow/react";
import { Label } from "./ui/label";

export interface OutHandleProps {
  label: string;

}

export default function OutHandle(props: OutHandleProps) {
  return (
    <div className="relative w-full justify-end flex">
      <Label>{props.label}</Label>
      <Handle type="source" position={Position.Right} className="!-right-4" />
    </div>
  );
}
