import input from './InputNode.code'
import output from './OutputNode.code'
import promptLLM from './PromptLLMNode.code'
import textReplace from './TextReplaceNode.code'
import textTemplate from './TextTemplateNode.code'
import fileReader from './FileReaderNode.code'
import dataNode from './DataNode.code'
import notesNode from './NotesNode.code'

const nodeImplementations = {
    input,
    output,
    promptLLM,
    textReplace,
    textTemplate,
    fileReader,
    dataNode,
    notesNode
}

export default nodeImplementations