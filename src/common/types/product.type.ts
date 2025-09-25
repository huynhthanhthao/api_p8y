import { PRODUCT_INCLUDE_FIELDS } from '@common/constants'
import { Prisma } from '@prisma/client'

export const productSelect = Prisma.validator<Prisma.ProductFindFirstArgs>()({
  ...PRODUCT_INCLUDE_FIELDS
})

export type Product = Prisma.ProductGetPayload<typeof productSelect>
