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

// Cache for the latest codes to reduce database queries in high-frequency scenarios
const codeCache = new Map<string, { code: string; timestamp: number }>()
const CACHE_TTL = 5000

export async function generateCodeModel<T extends Prisma.ModelName>(
  options: GenerateCodeOptions<T>
): Promise<string> {
  const { model, fieldName = 'code', storeCode, branchId, prefix: customPrefix } = options

  const config = getModelConfig(model)
  const prefix = customPrefix || config.prefix
  const codeLength = config.codeLength || 6

  // Create a unique cache key for this combination
  const cacheKey = `${model}-${storeCode || 'no-store'}-${branchId || 'no-branch'}-${prefix}`

  // Try to get from cache first
  const cached = codeCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    const latestCode = cached.code
    const numberPart = latestCode.replace(prefix, '')
    const currentNumber = parseInt(numberPart, 10)
    const nextNumber = !isNaN(currentNumber) ? currentNumber + 1 : 1
    const newCode = formatCode(prefix, nextNumber, codeLength)

    // Update cache with new code
    codeCache.set(cacheKey, { code: newCode, timestamp: Date.now() })

    return newCode
  }

  // Use a transaction to ensure atomicity and prevent race conditions
  return await prisma.$transaction(
    async tx => {
      const conditions: any = {}
      if (storeCode) conditions.storeCode = storeCode
      if (branchId) conditions.branchId = branchId

      // Build where condition for the specific prefix
      conditions[fieldName] = {
        startsWith: prefix
      }

      const prismaModel = tx[config.prismaMethod] as any

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
      const newCode = formatCode(prefix, nextNumber, codeLength)

      // Update cache
      codeCache.set(cacheKey, { code: newCode, timestamp: Date.now() })

      return newCode
    },
    {
      // Increase timeout if needed for high concurrency
      timeout: 10000,
      // Use serializable isolation level for maximum safety
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable
    }
  )
}

// Helper function to format code
function formatCode(prefix: string, number: number, length: number = 6): string {
  const numberPart = number.toString().padStart(length, '0')
  return `${prefix}${numberPart}`
}

// Optional: Function to reset cache (useful for testing)
export function resetCodeCache(): void {
  codeCache.clear()
}
