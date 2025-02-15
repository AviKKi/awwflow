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

function evaluateTextCondition(operator: Operator, leftValue: string, rightValue: string): boolean {
  switch (operator) {
    case 'isEqualTo':
      return leftValue === rightValue
    case 'isNotEqualTo':
      return leftValue !== rightValue
    case 'contains':
      return leftValue.includes(rightValue)
    case 'doesNotContain':
      return !leftValue.includes(rightValue)
    case 'startsWith':
      return leftValue.startsWith(rightValue)
    case 'endsWith':
      return leftValue.endsWith(rightValue)
    case 'isEmpty':
      return leftValue === ''
    case 'isNotEmpty':
      return leftValue !== ''
    default:
      return false
  }
}

function evaluateNumberCondition(operator: Operator, leftValue: number, rightValue: number): boolean {
  switch (operator) {
    case 'isEqualTo':
      return leftValue === rightValue
    case 'isNotEqualTo':
      return leftValue !== rightValue
    case 'isGreaterThan':
      return leftValue > rightValue
    case 'isLessThan':
      return leftValue < rightValue
    case 'isGreaterThanOrEqualTo':
      return leftValue >= rightValue
    case 'isLessThanOrEqualTo':
      return leftValue <= rightValue
    default:
      return false
  }
}

function evaluateListCondition(operator: Operator, leftValue: any[], rightValue: any): boolean {
  switch (operator) {
    case 'isEmpty':
      return leftValue.length === 0
    case 'isNotEmpty':
      return leftValue.length > 0
    case 'hasLength':
      return leftValue.length === Number(rightValue)
    case 'contains':
      return leftValue.includes(rightValue)
    case 'doesNotContain':
      return !leftValue.includes(rightValue)
    default:
      return false
  }
}

function evaluateObjectCondition(operator: Operator, leftValue: Record<string, any>, rightValue: string): boolean {
  switch (operator) {
    case 'isEmpty':
      return Object.keys(leftValue).length === 0
    case 'isNotEmpty':
      return Object.keys(leftValue).length > 0
    case 'hasKey':
      return rightValue in leftValue
    case 'doesNotHaveKey':
      return !(rightValue in leftValue)
    case 'hasValueForKey':
      return leftValue[rightValue] !== undefined
    case 'doesNotHaveValueForKey':
      return leftValue[rightValue] === undefined
    default:
      return false
  }
}

function evaluateCondition(condition: Condition, inputs: RuleCheckerInput): boolean {
  const { operator, leftId, rightId } = condition
  const leftValue = inputs[leftId]
  const rightValue = inputs[rightId]

  // Handle different data types
  if (typeof leftValue === 'string') {
    return evaluateTextCondition(operator, leftValue, String(rightValue))
  }
  
  if (typeof leftValue === 'number') {
    return evaluateNumberCondition(operator, leftValue, Number(rightValue))
  }
  
  if (Array.isArray(leftValue)) {
    return evaluateListCondition(operator, leftValue, rightValue)
  }
  
  if (typeof leftValue === 'object' && leftValue !== null) {
    return evaluateObjectCondition(operator, leftValue, String(rightValue))
  }

  return false
}

export default async function func(inputs: RuleCheckerInput): Promise<boolean> {
  const { conditions } = inputs
  if (!conditions || conditions.length === 0) {
    return true
  }

  return conditions.every(condition => evaluateCondition(condition, inputs))
} 