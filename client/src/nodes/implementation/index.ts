import input from './InputNode.code'
import promptLLM from './PromptLLMNode.code'
import textReplace from './TextReplaceNode.code'
import textTemplateNode from './TextTemplateNode.code'
import fileReader from './FileReaderNode.code'

const nodeImplementations = {
    input,
    promptLLM,
    textReplace,
    textTemplate: textTemplateNode,
    fileReader
}

export default nodeImplementations