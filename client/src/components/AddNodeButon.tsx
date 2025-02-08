import { DragEvent, DragEventHandler, useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  FiArrowDown,
  FiArrowUp,
  FiFileText,
  FiPlus,
  FiX,
} from "react-icons/fi";
import { RxMagicWand } from "react-icons/rx";
import { useDnD } from "../utils/dragAndDrop";
interface NodeCardProps {
  icon: any;
  title: string;
  description: string;
  type: string;
}
function NodeDetailCard(props: NodeCardProps) {
  const [_, setType] = useDnD();
  const onDragStart: DragEventHandler<HTMLDivElement> = (
    event: DragEvent<HTMLDivElement>
  ) => {
    setType(props.type);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className=" flex items-center space-x-4 rounded-md border p-4"
    >
      {props.icon}
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">{props.title}</p>
        <p className="text-sm text-muted-foreground">{props.description}</p>
      </div>
    </div>
  );
}

const nodesDetails = [
  {
    icon: <FiArrowDown />,
    title: "Input",
    description: "User entered data for your program.",
    type: "input",
  },
  {
    icon: <FiArrowUp />,
    title: "Output",
    description: "Output of your program",
    type: "output",
  },
  {
    icon: <RxMagicWand />,
    title: "Prompt AI",
    description: "Generate response from LLM",
    type: "promptLLM",
  },
  {
    icon: <FiFileText />,
    title: "File Reader",
    description: "Extract text from a file",
    type: "fileReader",
  },
];

function NodesListCard({ onClose }: { onClose: () => void }) {
  return (
    <Card className="h-max absolute left-0 top-0">
      <CardHeader>
        <CardTitle>
          Add Node{" "}
          <Button
            size="icon"
            onClick={onClose}
            className="right-6 absolute float-right"
            variant="outline"
          >
            <FiX />
          </Button>
        </CardTitle>
        <CardDescription>Add a new node to your program</CardDescription>
      </CardHeader>
      <CardContent className="gap-2 flex flex-col">
        {nodesDetails.map((item) => (
          <NodeDetailCard {...item} key={item.title} />
        ))}
      </CardContent>
    </Card>
  );
}

export default function AddNodeButton() {
  const [showMenu, setShowMenu] = useState(false);
  const toggleShowMenu = () => setShowMenu((flag) => !flag);
  return (
    <div className="absolute z-20 left-2 top-2">
      {showMenu && (
        <div className="w-80">
          <NodesListCard onClose={toggleShowMenu} />
        </div>
      )}
      {!showMenu && (
        <Button size="sm" onClick={toggleShowMenu}>
          <FiPlus />
          Add
        </Button>
      )}
    </div>
  );
}
