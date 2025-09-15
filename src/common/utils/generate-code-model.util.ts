import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface GenerateCodeOptions<T extends Prisma.ModelName> {
  model: T
  storeCode?: string
  branchId?: string
  fieldName?: string
}

// Interface for model configuration
interface ModelConfig {
  prefix: string
  prismaMethod: keyof PrismaClient
}

// Map model names to their configurations
const MODEL_CONFIGS: Partial<Record<Prisma.ModelName, ModelConfig>> = {
  Customer: {
    prefix: 'KH',
    prismaMethod: 'customer'
  },
  Product: {
    prefix: 'SP',
    prismaMethod: 'product'
  }
}

// Get configuration for a specific model
function getModelConfig(model: Prisma.ModelName): ModelConfig {
  const config = MODEL_CONFIGS[model]
  if (!config) {
    throw new Error(`Unsupported model: ${model}`)
  }
  return config
}

// Build where conditions for the query
function buildWhereConditions(conditions: any, prefix: string, fieldName: string): any {
  return {
    ...conditions,
    [fieldName]: {
      startsWith: prefix
    }
  }
}

// Find the latest record for a given model
async function findLatestRecord<T extends Prisma.ModelName>(
  model: T,
  conditions: any,
  fieldName: string,
  prefix: string
): Promise<any> {
  const config = getModelConfig(model)
  const prismaModel = prisma[config.prismaMethod] as any

  return await prismaModel.findFirst({
    where: buildWhereConditions(conditions, prefix, fieldName),
    orderBy: {
      [fieldName]: 'desc'
    },
    select: {
      [fieldName]: true
    }
  })
}

// Extract the next number from the latest code
function getNextNumber(latestCode: string | null, prefix: string): number {
  if (!latestCode) return 1

  const numberPart = latestCode.replace(prefix, '')
  const currentNumber = parseInt(numberPart, 10)

  return !isNaN(currentNumber) ? currentNumber + 1 : 1
}

// Format the final code with prefix and padded number
function formatCode(prefix: string, number: number): string {
  const numberPart = number.toString().padStart(6, '0')
  return `${prefix}${numberPart}`
}

export async function generateCodeModel<T extends Prisma.ModelName>(
  options: GenerateCodeOptions<T>
): Promise<string> {
  const { model, fieldName = 'code', storeCode, branchId } = options

  const config = getModelConfig(model)
  const prefix = config.prefix

  const conditions: any = {}
  if (storeCode) conditions.storeCode = storeCode
  if (branchId) conditions.branchId = branchId

  try {
    const latestRecord = await findLatestRecord(model, conditions, fieldName, prefix)

    const latestCode = latestRecord?.[fieldName] || null
    const nextNumber = getNextNumber(latestCode, prefix)

    return formatCode(prefix, nextNumber)
  } catch (error) {
    throw new Error(`Failed to generate code: ${(error as Error).message}`)
  }
}
