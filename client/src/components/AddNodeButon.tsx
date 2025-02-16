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
import { Input } from "./ui/input";
import {
  FiArrowDown,
  FiArrowUp,
  FiFileText,
  FiPlus,
  FiX,
  FiType,
  FiFile,
  FiCheckCircle,
} from "react-icons/fi";
import { RxMagicWand } from "react-icons/rx";
import { useDnD } from "../utils/dragAndDrop";
import { TextQuote, Database, StickyNote, ToggleLeft } from 'lucide-react'
import { nodesMetadata } from '../nodes'

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

  const Icon = props.icon;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="flex items-center space-x-4 rounded-md border p-4"
    >
      <Icon className="h-4 w-4" />
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">{props.title}</p>
        <p className="text-sm text-muted-foreground">{props.description}</p>
      </div>
    </div>
  );
}

const nodesDetails = nodesMetadata

function NodesListCard({ onClose }: { onClose: () => void }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredNodes = nodesDetails.filter(node => 
    node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    node.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
        <Input
          type="text"
          placeholder="Search nodes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mt-2"
        />
      </CardHeader>
      <CardContent className="gap-2 flex flex-col max-h-[calc(100vh-160px)] overflow-y-scroll">
        {filteredNodes.map((item) => (
          <NodeDetailCard {...item} key={item.title} />
        ))}
        {filteredNodes.length === 0 && (
          <div className="text-sm text-muted-foreground text-center py-2">
            No nodes found matching your search
          </div>
        )}
      </CardContent>
    </Card>
  )
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
