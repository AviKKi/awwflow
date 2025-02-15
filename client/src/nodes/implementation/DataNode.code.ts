interface DataNodeInput {
  dataType: 'Text' | 'Number' | 'List' | 'Boolean' | 'Collection'
  value: string | number | boolean | any[] | object
}

export default async function func({ value }: DataNodeInput) {
  return value
} 