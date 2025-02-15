import input from './InputNode.code'
import output from './OutputNode.code'
import promptLLM from './PromptLLMNode.code'
import textReplace from './TextReplaceNode.code'
import textTemplate from './TextTemplateNode.code'
import fileReader from './FileReaderNode.code'
import dataNode from './DataNode.code'

const nodeImplementations = {
    input,
    output,
    promptLLM,
    textReplace,
    textTemplate,
    fileReader,
    dataNode
}

export default nodeImplementations