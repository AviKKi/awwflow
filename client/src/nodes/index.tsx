import { BuiltInNode, Node } from "@xyflow/react";
import ColorInputNode, {type IColorInputNode} from "./ColorInputNode";
import GradientOutputNode, { IGradientNode } from "./GradientOutputNode";
import InputNode, { IInputNode, inputNodeDefaultData } from "./InputNode";
import PromptLLMNode, { IPromptLLMNode, promptLLMNodeDefaultData } from "./PromptLLMNode";
import OutputNode, { IOutputNode, outputNodeDefaultData } from "./OutputNode";
import { ITextReplaceNode, textReplaceNodeDefaultData } from './TextReplaceNode'
import TextReplaceNode from './TextReplaceNode'

export type AppNode = IColorInputNode | IGradientNode | IInputNode | IOutputNode | IPromptLLMNode | BuiltInNode | ITextReplaceNode
export const NodeDefaultValues = {
    input: inputNodeDefaultData,
    output: outputNodeDefaultData,
    promptLLM: promptLLMNodeDefaultData,
    textReplace: textReplaceNodeDefaultData,
} as const
export const NodeTypes = { input: InputNode, output: OutputNode, promptLLM: PromptLLMNode, colorInput: ColorInputNode, gradientOutput: GradientOutputNode, textReplace: TextReplaceNode };
