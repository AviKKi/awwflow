import input from './InputNode.code'
import promptLLM from './PromptLLMNode.code'
import textReplace from './TextReplaceNode.code'
import textTemplateNode from './TextTemplateNode.code'

const nodeImplementations = {
    input,
    promptLLM,
    textReplace,
    textTemplate: textTemplateNode
}

export default nodeImplementations