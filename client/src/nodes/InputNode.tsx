import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import useStore from "../store";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "@radix-ui/react-separator";
import NodeCard from "../components/NodeCard";
import { Textarea } from "../components/ui/textarea";
import OutHandle from "../components/OutputHandle";
import InputHandle from "../components/InputHandle";

export type IInputNode = Node<
  {
    defaultValue: string;
    inputName: string;
  },
  "input"
>;

export const inputNodeDefaultData = {
  defaultValue: "",
  inputName: "",
};

export default function InputNode({ id, data }: NodeProps<IInputNode>) {
  const updateNodeData = useStore((state) => state.updateNodeData);

  return (
    <NodeCard title="Input Node" description="User entered input can be accessed from here">
     <div className="flex flex-col gap-2">
      <OutHandle label="Output" />
      <InputHandle label="Default Value" >
      <Textarea
          className="nodrag nopan"
          value={data.defaultValue}
 
          onChange={(e) =>
            updateNodeData(id , {
              defaultValue: e.target.value,
            })
          }
        />
      </InputHandle>
      
      <Separator className="py-2" />
      <div className="grid hidden w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="defaultValue">Input Name</Label>
        <Input
          value={data.inputName}
          onChange={(e) =>
            updateNodeData(id , {
              inputName: e.target.value,
            })
          }

          type="text"
        />
      </div>
      </div>
    </NodeCard>
  );
}
