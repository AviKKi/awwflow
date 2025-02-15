type DataType = 'Text' | 'Number' | 'List' | 'Collection'
type Operator = 
  | 'isEqualTo' | 'isNotEqualTo' | 'contains' | 'doesNotContain'
  | 'startsWith' | 'endsWith' | 'isEmpty' | 'isNotEmpty'
  | 'isGreaterThan' | 'isLessThan' | 'isGreaterThanOrEqualTo' | 'isLessThanOrEqualTo'
  | 'hasLength' | 'hasKey' | 'doesNotHaveKey' | 'hasValueForKey' | 'doesNotHaveValueForKey'

interface Condition {
  id: string
  leftId: string
  operator: Operator
  rightId: string
}

interface RuleCheckerInput {
  conditions: Condition[]
  [key: string]: any // For dynamic input handles
}

function evaluateCondition(condition: Condition, inputs: RuleCheckerInput): boolean {
  const { operator, leftId, rightId } = condition
  const leftValue = inputs[leftId]
  const rightValue = inputs[rightId]

  // Handle empty checks first
  if (operator === 'isEmpty') {
    if (Array.isArray(leftValue)) return leftValue.length === 0
    if (typeof leftValue === 'string') return leftValue === ''
    if (typeof leftValue === 'object') return Object.keys(leftValue).length === 0
    return false
  }

  if (operator === 'isNotEmpty') {
    if (Array.isArray(leftValue)) return leftValue.length > 0
    if (typeof leftValue === 'string') return leftValue !== ''
    if (typeof leftValue === 'object') return Object.keys(leftValue).length > 0
    return false
  }

  // Handle other operators
  switch (operator) {
    // Text operators
    case 'isEqualTo':
      return leftValue === rightValue
    case 'isNotEqualTo':
      return leftValue !== rightValue
    case 'contains':
      return String(leftValue).includes(String(rightValue))
    case 'doesNotContain':
      return !String(leftValue).includes(String(rightValue))
    case 'startsWith':
      return String(leftValue).startsWith(String(rightValue))
    case 'endsWith':
      return String(leftValue).endsWith(String(rightValue))

    // Number operators
    case 'isGreaterThan':
      return Number(leftValue) > Number(rightValue)
    case 'isLessThan':
      return Number(leftValue) < Number(rightValue)
    case 'isGreaterThanOrEqualTo':
      return Number(leftValue) >= Number(rightValue)
    case 'isLessThanOrEqualTo':
      return Number(leftValue) <= Number(rightValue)

    // List operators
    case 'hasLength':
      return Array.isArray(leftValue) && leftValue.length === Number(rightValue)
    case 'contains':
      return Array.isArray(leftValue) && leftValue.includes(rightValue)
    case 'doesNotContain':
      return Array.isArray(leftValue) && !leftValue.includes(rightValue)

    // Object operators
    case 'hasKey':
      return typeof leftValue === 'object' && String(rightValue) in leftValue
    case 'doesNotHaveKey':
      return typeof leftValue === 'object' && !(String(rightValue) in leftValue)
    case 'hasValueForKey':
      return typeof leftValue === 'object' && leftValue[String(rightValue)] !== undefined
    case 'doesNotHaveValueForKey':
      return typeof leftValue === 'object' && leftValue[String(rightValue)] === undefined

    default:
      return false
  }
}

export default async function func(inputs: RuleCheckerInput): Promise<boolean> {
  const { conditions } = inputs
  if (!conditions || conditions.length === 0) {
    return true
  }

  return conditions.every(condition => evaluateCondition(condition, inputs))
} 