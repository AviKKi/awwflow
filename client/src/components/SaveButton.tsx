import { FiSettings } from "react-icons/fi";
import { Button } from "./ui/button";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Input } from "./ui/input";
import useStore from "../store";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogContent,
  DialogTitle,
} from "./ui/dialog";

function SaveDialog(props: any) {
  return (
    <AlertDialog open={props.show} onOpenChange={props.onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Save your workflow</AlertDialogTitle>
          <AlertDialogDescription>
            This is saved in your browser, using the provided workflow name
            <Input
              value={props.projectName}
              onChange={(e) => props.setProjectName(e.target.value)}
              className="mt-2"
              type="text"
              placeholder="Workflow Name"
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={props.onSave}>Save</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function OpenWorkflowDialog(props: any) {
  return (
    <Dialog open={props.show} onOpenChange={props.onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Open</DialogTitle>
          <DialogDescription>
            Click on any of your saved workflow to open it
          </DialogDescription>
        </DialogHeader>
        <div>
          {props.workflows.map((w) => (
            <li
              onClick={() => props.onOpen(w)}
              className="cursor-pointer"
              key={w}
            >
              {w}
            </li>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function SaveButton() {
  const [projectName, setProjectName] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showOpenDialog, setShowOpenDialog] = useState(false);
  const [savedWorkflows, setSavedWorkflows] = useState<string[]>([]);
  const dumpGraph = useStore((state) => state.dump);
  const loadGraph = useStore((state) => state.load);
  function handleSave() {
    let savedWorkflows: string | null | string[] =
      localStorage.getItem("savedWorkflows");
    if (!savedWorkflows) {
      savedWorkflows = [projectName];
    } else {
      savedWorkflows = Array.from(
        new Set([...JSON.parse(savedWorkflows), projectName])
      );
    }
    localStorage.setItem("savedWorkflows", JSON.stringify(savedWorkflows));
    localStorage.setItem(
      `workflow:${projectName}`,
      JSON.stringify(dumpGraph())
    );
  }

  function handleOpenButtonClick() {
    const graph = localStorage.getItem("savedWorkflows");
    setSavedWorkflows(graph ? JSON.parse(graph) : []);
    setShowOpenDialog(true);
  }
  function handleOpen(workflowName: string) {
    const graph = localStorage.getItem(`workflow:${workflowName}`);
    if (!graph) {
      throw new Error(`workflow:${workflowName} not found in localStorage`);
    }
    loadGraph(graph);
    setShowOpenDialog(false);
  }

  return (
    <>
      <OpenWorkflowDialog
        show={showOpenDialog}
        onClose={() => setShowOpenDialog(false)}
        workflows={savedWorkflows}
        onOpen={handleOpen}
      />
      <SaveDialog
        show={showSaveDialog}
        onClose={setShowSaveDialog}
        projectName={projectName}
        setProjectName={setProjectName}
        onSave={handleSave}
      />
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <Button onClick={() => setShowSaveDialog(true)} variant="outline">
          Save
        </Button>
        <Button onClick={handleOpenButtonClick} variant="outline">
          Open
        </Button>
        <Button variant="outline">
          <FiSettings />
        </Button>
      </div>
    </>
  );
}
