interface RuleGateInput {
  isEnabled: boolean
}

export default async function func({ isEnabled }: RuleGateInput): Promise<void> {
  // Rule Gate is a parent node that controls child execution
  // No direct output, it affects the flow engine's execution of child nodes
  return
} 