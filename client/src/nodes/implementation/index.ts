import input from './InputNode.code'
import output from './OutputNode.code'
import promptLLM from './PromptLLMNode.code'
import textReplace from './TextReplaceNode.code'
import textTemplate from './TextTemplateNode.code'
import fileReader from './FileReaderNode.code'
import dataNode from './DataNode.code'
import notesNode from './NotesNode.code'
import ruleChecker from './RuleCheckerNode.code'
import ruleGateNode from './RuleGateNode.code'
import wireClipNode from './WireClipNode.code'

const nodeImplementations = {
    input,
    output,
    promptLLM,
    textReplace,
    textTemplate,
    fileReader,
    dataNode,
    notesNode,
    ruleCheckerNode: ruleChecker,
    ruleGateNode,
    wireClipNode
}

export default nodeImplementations