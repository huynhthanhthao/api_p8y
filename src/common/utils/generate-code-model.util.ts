import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface GenerateCodeOptions<T extends Prisma.ModelName> {
  model: T
  storeCode?: string
  branchId?: string
  fieldName?: string
  prefix?: string // Allow custom prefix override
}

// Interface for model configuration
interface ModelConfig {
  prefix: string
  prismaMethod: keyof PrismaClient
  codeLength?: number // Allow custom code length
}

// Map model names to their configurations
const MODEL_CONFIGS: Partial<Record<Prisma.ModelName, ModelConfig>> = {
  Customer: {
    prefix: 'KH',
    prismaMethod: 'customer',
    codeLength: 6
  },
  Product: {
    prefix: 'SP',
    prismaMethod: 'product',
    codeLength: 6
  },
  Supplier: {
    prefix: 'NCC',
    prismaMethod: 'supplier',
    codeLength: 6
  },
  Invoice: {
    prefix: 'HD',
    prismaMethod: 'invoice',
    codeLength: 6
  },
  StockTransaction: {
    prefix: 'PN',
    prismaMethod: 'stockTransaction',
    codeLength: 6
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

export function generateCodeIncrease(baseCode: string, increment: number = 1): string {
  const match = baseCode.match(/^(\D*)(\d+)$/)

  if (!match) {
    throw new Error('Invalid code format. Code must end with numbers')
  }

  const prefix = match[1] // Phần chữ cái
  const numberStr = match[2] // Phần số
  const numberLength = numberStr.length // Độ dài phần số

  const currentNumber = parseInt(numberStr, 10)
  const newNumber = currentNumber + increment

  // Format lại phần số với đúng số lượng chữ số ban đầu
  const newNumberStr = newNumber.toString().padStart(numberLength, '0')

  // Nếu phần số mới dài hơn phần số ban đầu, giữ nguyên độ dài mới
  if (newNumberStr.length > numberLength) {
    return prefix + newNumberStr
  }

  return prefix + newNumberStr
}

export async function generateCodeModel<T extends Prisma.ModelName>(
  options: GenerateCodeOptions<T>
): Promise<string> {
  const { model, fieldName = 'code', storeCode, branchId, prefix: customPrefix } = options

  const config = getModelConfig(model)
  const prefix = customPrefix || config.prefix
  const codeLength = config.codeLength || 6

  const conditions: any = {}
  if (storeCode) conditions.storeCode = storeCode
  if (branchId) conditions.branchId = branchId

  // Build where condition for the specific prefix
  conditions[fieldName] = {
    startsWith: prefix
  }

  const prismaModel = prisma[config.prismaMethod] as any

  // Find the latest record with the specific prefix
  const latestRecord = await prismaModel.findFirst({
    where: conditions,
    orderBy: {
      [fieldName]: 'desc'
    },
    select: {
      [fieldName]: true
    }
  })

  const latestCode = latestRecord?.[fieldName] || null
  let nextNumber = 1

  if (latestCode) {
    const numberPart = latestCode.replace(prefix, '')
    const currentNumber = parseInt(numberPart, 10)
    nextNumber = !isNaN(currentNumber) ? currentNumber + 1 : 1
  }

  // Format the code with prefix and padded number
  return formatCode(prefix, nextNumber, codeLength)
}

// Helper function to format code
function formatCode(prefix: string, number: number, length: number = 6): string {
  const numberPart = number.toString().padStart(length, '0')
  return `${prefix}${numberPart}`
}
