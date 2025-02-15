import { BuiltInNode, Node } from "@xyflow/react";
import ColorInputNode, {type IColorInputNode} from "./ColorInputNode";
import GradientOutputNode, { IGradientNode } from "./GradientOutputNode";
import InputNode, { IInputNode, inputNodeDefaultData } from "./InputNode";
import PromptLLMNode, { IPromptLLMNode, promptLLMNodeDefaultData } from "./PromptLLMNode";
import OutputNode, { IOutputNode, outputNodeDefaultData } from "./OutputNode";
import { ITextReplaceNode, textReplaceNodeDefaultData } from './TextReplaceNode'
import TextReplaceNode from './TextReplaceNode'
import TextTemplateNode, { ITextTemplateNode, textTemplateNodeDefaultData } from './TextTemplateNode'
import FileReaderNode, { IFileReaderNode, fileReaderNodeDefaultData } from './FileReaderNode'
import DataNode, { IDataNode, dataNodeDefaultData } from './DataNode'
import NotesNode, { INotesNode, notesNodeDefaultData } from './NotesNode'
import RuleCheckerNode, { IRuleCheckerNode, ruleCheckerNodeDefaultData } from './RuleCheckerNode'
import { RuleGateNode, IRuleGateNode, ruleGateNodeDefaultData } from './RuleGateNode'

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
    ruleGateNode: ruleGateNodeDefaultData
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
    ruleGateNode: RuleGateNode
}
/** mapping from nodeType to human readble node names, preferably the one you see on UI as node heading */
export const NodeTypeToNodeName: Record<string, string> = {
    input: "Input",
    output: "Output",
    promptLLM: "Prompt AI",
    textReplace: 'Text Replace',
    textTemplate: 'Text Template',
    fileReader: 'File Reader',
    dataNode: 'Data',
    notesNode: 'Notes',
    ruleCheckerNode: 'Rule Checker',
    ruleGateNode: 'Rule Gate'
}