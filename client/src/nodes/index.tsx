import { BuiltInNode, Node } from "@xyflow/react";
import ColorInputNode, {type IColorInputNode} from "./ColorInputNode";
import GradientOutputNode, { IGradientNode } from "./GradientOutputNode";
import InputNode, { IInputNode, inputNodeDefaultData, inputNodeMetadata } from "./InputNode";
import PromptLLMNode, { IPromptLLMNode, promptLLMNodeDefaultData, promptLLMNodeMetadata } from "./PromptLLMNode";
import OutputNode, { IOutputNode, outputNodeDefaultData, outputNodeMetadata } from "./OutputNode";
import { ITextReplaceNode, textReplaceNodeDefaultData, textReplaceNodeMetadata } from './TextReplaceNode'
import TextReplaceNode from './TextReplaceNode'
import TextTemplateNode, { ITextTemplateNode, textTemplateNodeDefaultData, textTemplateNodeMetadata } from './TextTemplateNode'
import FileReaderNode, { IFileReaderNode, fileReaderNodeDefaultData, fileReaderNodeMetadata } from './FileReaderNode'
import DataNode, { IDataNode, dataNodeDefaultData, dataNodeMetadata } from './DataNode'
import NotesNode, { INotesNode, notesNodeDefaultData, notesNodeMetadata } from './NotesNode'
import RuleCheckerNode, { IRuleCheckerNode, ruleCheckerNodeDefaultData, ruleCheckerNodeMetadata } from './RuleCheckerNode'
import { RuleGateNode, IRuleGateNode, ruleGateNodeDefaultData, ruleGateNodeMetadata } from './RuleGateNode'
import { FiArrowUp, FiType, FiFile, FiCheckCircle } from 'react-icons/fi'
import { RxMagicWand } from 'react-icons/rx'
import { TextQuote, Database, StickyNote, ToggleLeft } from 'lucide-react'
import WireClipNode, { IWireClipNode, wireClipNodeDefaultData, wireClipNodeMetadata } from './WireClipNode'

export type AppNode =
  | IColorInputNode
  | IGradientNode
  | IInputNode
  | IOutputNode
  | IPromptLLMNode
  | BuiltInNode
  | ITextReplaceNode
  | ITextTemplateNode
  | IFileReaderNode
  | IDataNode
  | INotesNode
  | IRuleCheckerNode
  | IRuleGateNode
  | IWireClipNode

export const NodeDefaultValues = {
    input: inputNodeDefaultData,
    output: outputNodeDefaultData,
    promptLLM: promptLLMNodeDefaultData,
    textReplace: textReplaceNodeDefaultData,
    textTemplate: textTemplateNodeDefaultData,
    fileReader: fileReaderNodeDefaultData,
    dataNode: dataNodeDefaultData,
    notesNode: notesNodeDefaultData,
    ruleCheckerNode: ruleCheckerNodeDefaultData,
    ruleGateNode: ruleGateNodeDefaultData,
    wireClipNode: wireClipNodeDefaultData
} as const

export const NodeTypes = {
    input: InputNode,
    output: OutputNode,
    promptLLM: PromptLLMNode,
    colorInput: ColorInputNode,
    gradientOutput: GradientOutputNode,
    textReplace: TextReplaceNode,
    textTemplate: TextTemplateNode,
    fileReader: FileReaderNode,
    dataNode: DataNode,
    notesNode: NotesNode,
    ruleCheckerNode: RuleCheckerNode,
    ruleGateNode: RuleGateNode,
    wireClipNode: WireClipNode,
}

/** Node metadata for AddNodeButton and other UI components */
export const nodesMetadata = [
  inputNodeMetadata,
  outputNodeMetadata,
  promptLLMNodeMetadata,
  textReplaceNodeMetadata,
  fileReaderNodeMetadata,
  textTemplateNodeMetadata,
  dataNodeMetadata,
  notesNodeMetadata,
  ruleCheckerNodeMetadata,
  ruleGateNodeMetadata,
  wireClipNodeMetadata,
] as const

/** mapping from nodeType to human readable node names, computed from metadata */
export const NodeTypeToNodeName: Record<string, string> = Object.fromEntries(
  nodesMetadata.map(meta => [meta.type, meta.title])
)

export interface NodeMetadata {
  icon: React.ComponentType
  title: string
  description: string
  type: string
}