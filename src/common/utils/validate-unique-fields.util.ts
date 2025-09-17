import { PRODUCT_ERROR } from '@common/errors'
import { HttpException } from '@common/exceptions'
import { CreateProductRequestDto, UpdateProductRequestDto } from '@interface-adapter/dtos/products'
import { HttpStatus } from '@nestjs/common'
import { PrismaClient } from '@prisma/client/extension'

export async function validateUniqueFields(
  prisma: PrismaClient,
  dto: CreateProductRequestDto | UpdateProductRequestDto,
  branchId: string,
  id?: string
): Promise<void> {
  const codes = [dto.code, ...(dto.variants?.map(p => p.code) || [])].filter(Boolean)
  const barcodes = [dto.barcode, ...(dto.variants?.map(p => p.barcode) || [])].filter(Boolean)

  if (!codes.length && !barcodes.length) return

  // Tìm sản phẩm đầu tiên có mã hoặc mã vạch trùng
  const existingProduct = await prisma.product.findFirst({
    where: {
      ...(id && {
        id: {
          not: id
        }
      }),
      branchId,
      OR: [
        ...(codes.length > 0 ? [{ code: { in: codes } }] : []),
        ...(barcodes.length > 0 ? [{ barcode: { in: barcodes } }] : [])
      ]
    },
    select: { code: true, barcode: true }
  })

  if (!existingProduct) return

  // Kiểm tra trùng mã
  if (existingProduct.code && codes.includes(existingProduct.code)) {
    throw new HttpException(HttpStatus.CONFLICT, PRODUCT_ERROR.CODE_EXISTS, [existingProduct.code])
  }

  // Kiểm tra trùng mã vạch
  if (existingProduct.barcode && barcodes.includes(existingProduct.barcode)) {
    throw new HttpException(HttpStatus.CONFLICT, PRODUCT_ERROR.BARCODE_EXISTS, [
      existingProduct.barcode
    ])
  }
}
