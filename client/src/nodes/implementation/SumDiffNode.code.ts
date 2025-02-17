interface SumDiffInput {
  number1: string
  number2: string
}

interface SumDiffOutput {
  sum: number
  diff: number
}

export default async function func({
  number1,
  number2
}: SumDiffInput): Promise<SumDiffOutput> {
  const num1 = parseFloat(number1)
  const num2 = parseFloat(number2)

  if (isNaN(num1) || isNaN(num2)) {
    throw new Error('Invalid input: Both inputs must be valid numbers')
  }

  return {
    sum: num1 + num2,
    diff: num1 - num2
  }
} 