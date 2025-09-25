import { PrismaService } from '@infrastructure/prisma'
import { Product } from '@common/types'
import { HttpException } from '@common/exceptions'
import { HttpStatus } from '@nestjs/common'
import { PRODUCT_ERROR } from '@common/errors'
import { PRODUCT_INCLUDE_FIELDS } from '@common/constants'

export async function getProductById(
  prisma: PrismaService,
  id: string,
  branchId: string
): Promise<Product> {
  const product = await prisma.product.findUnique({
    where: { id, branchId },
    ...PRODUCT_INCLUDE_FIELDS
  })

  if (!product) {
    throw new HttpException(HttpStatus.NOT_FOUND, PRODUCT_ERROR.PRODUCT_NOT_FOUND)
  }

  return product
}
