import { Handle, Position } from "@xyflow/react";
import { Label } from "./ui/label";

interface InputHandleProps {
  label: string;
  children?: React.ReactElement | React.ReactElement[] | boolean;
  id?: string;
  dataPath?: string;
}

export default function InputHandle(props: InputHandleProps) {
  return (
    <div className="grid relative w-full min-w-64 max-w-sm items-center gap-1.5">
      <Label htmlFor="defaultValue">{props.label}</Label>
      <Handle 
        id={props.id} 
        type="target" 
        position={Position.Left} 
        className="absolute !-left-4 !top-2"
        data-path={props.dataPath}
      />
      {props.children}
    </div>
  );
}
