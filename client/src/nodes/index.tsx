import { BuiltInNode } from "@xyflow/react";
import ColorInputNode, {type IColorInputNode} from "./ColorInputNode";
import GradientOutputNode, { IGradientNode } from "./GradientOutputNode";
import InputNode, { IInputNode, inputNodeDefaultData } from "./InputNode";
import PromptLLMNode, { IPromptLLMNode, promptLLMNodeDefaultData } from "./PromptLLMNode";
import OutputNode, { IOutputNode, outputNodeDefaultData } from "./OutputNode";

export type AppNode = IColorInputNode | IGradientNode | IInputNode | IOutputNode | IPromptLLMNode | BuiltInNode
export const NodeDefaultValues = {
    input: inputNodeDefaultData,
    output: outputNodeDefaultData,
    promptLLM: promptLLMNodeDefaultData,

}
export const NodeTypes = { input: InputNode, output: OutputNode, promptLLM: PromptLLMNode, colorInput: ColorInputNode, gradientOutput: GradientOutputNode };
