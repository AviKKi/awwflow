import { ReactElement, useState } from "react";
import { Button } from "../components/ui/button";
import useExecutionStore from "../store/executionStore";
import run from "./index";
import { FiFile, FiPlay, FiX } from "react-icons/fi";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { stat } from "fs";

function OutputModal({ onClose }: { onClose: () => void }) {
  const status = useExecutionStore((state) => state.status);
  const nodeOutputs = useExecutionStore(state => state.nodeOutputs)
  let statusBadge: null | ReactElement = null;
  if (status === "DONE") {
    statusBadge = <Badge color="green">Done</Badge>;
  } else if (status === "PROCESSING") {
    statusBadge = <Badge color="yellow">Processing</Badge>;
  }
  return (
    <Card className="h-[calc(100vh-110px)] w-[50vw] absolute right-2 bottom-12">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <div className="">
            <span className="mr-2">Output</span>
            {statusBadge}
          </div>
          <div>
            <Button
              size="icon"
              onClick={onClose}
              className="right-6 absolute float-right"
              variant="outline"
            >
              <FiX />
            </Button>
          </div>

        </CardTitle>
      </CardHeader>
      <CardContent className="gap-2 flex flex-col">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NodeId</TableHead>
              <TableHead>Output</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(nodeOutputs).map(([id, output]) => <TableRow key={id}>
              <TableCell>{id}</TableCell>
              <TableCell>{output}</TableCell>
            </TableRow>)}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default function RunButton() {
  const [showOutput, setShowOutput] = useState(false);
  const status = useExecutionStore((state) => state.status);
  const nodeOutputs = useExecutionStore(state => state.nodeOutputs)
  const showOutputButton = !(status === 'IDLE' && Object.entries(nodeOutputs).length === 0)
  function handleRun(){
    run()
    setShowOutput(true)
  }
  return (
    <div className="absolute bottom-2 right-2">
      <Button
        disabled={status==='PROCESSING'}
        onClick={handleRun}
        className="mr-2"
      >
        <FiPlay />
        Run
      </Button>
      {showOutputButton && <Button variant="ghost" onClick={() => setShowOutput((s) => !s)}>
        <FiFile />
        Outputs
      </Button>}
      {showOutput && <OutputModal onClose={() => setShowOutput(false)} />}
    </div>
  );
}
