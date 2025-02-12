export default async function func({
  text,
  searchValue,
  newValue
}: {
  text: string
  searchValue: string
  newValue: string
}) {
  if (!text || !searchValue) {
    return text
  }

  try {
    // const regex = new RegExp(searchValue, 'g')
    return text.replace(searchValue, newValue)
  } catch (error) {
    console.error('Error in text replace operation:', error)
    throw error
  }
} 