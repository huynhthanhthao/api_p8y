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
  // B1: Map code/barcode -> id (nếu có)
  const codeMap = new Map<string, string | undefined>()
  const barcodeMap = new Map<string, string | undefined>()

  if (dto.code) codeMap.set(dto.code, id)
  if (dto.barcode) barcodeMap.set(dto.barcode, id)

  dto.variants?.forEach(v => {
    if (v.code) codeMap.set(v.code, v.id)
    if (v.barcode) barcodeMap.set(v.barcode, v.id)
  })

  const codes = [...codeMap.keys()]
  const barcodes = [...barcodeMap.keys()]

  if (!codes.length && !barcodes.length) return

  // B2: check duplicate trong DTO
  function findDuplicates(arr: string[]) {
    return arr.filter((item, i) => arr.indexOf(item) !== i)
  }

  const dupCodes = findDuplicates(codes)
  if (dupCodes.length > 0) {
    throw new HttpException(HttpStatus.CONFLICT, PRODUCT_ERROR.CODE_EXISTS, dupCodes[0])
  }

  const dupBarCodes = findDuplicates(barcodes)
  if (dupBarCodes.length > 0) {
    throw new HttpException(HttpStatus.CONFLICT, PRODUCT_ERROR.BARCODE_EXISTS, dupBarCodes[0])
  }

  // B3: check DB
  const existing = await prisma.product.findFirst({
    where: {
      branchId,
      OR: [
        ...(codes.length ? [{ code: { in: codes } }] : []),
        ...(barcodes.length ? [{ barcode: { in: barcodes } }] : [])
      ]
    },
    select: { id: true, code: true, barcode: true }
  })

  if (!existing) return

  // B4: loại bỏ chính nó bằng map
  if (existing.code && codes.includes(existing.code)) {
    const expectId = codeMap.get(existing.code)
    if (!expectId || existing.id !== expectId) {
      throw new HttpException(HttpStatus.CONFLICT, PRODUCT_ERROR.CODE_EXISTS, existing.code)
    }
  }

  if (existing.barcode && barcodes.includes(existing.barcode)) {
    const expectId = barcodeMap.get(existing.barcode)
    if (!expectId || existing.id !== expectId) {
      throw new HttpException(HttpStatus.CONFLICT, PRODUCT_ERROR.BARCODE_EXISTS, existing.barcode)
    }
  }
}
