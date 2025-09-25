import { PRODUCT_ERROR } from '@common/errors'
import { HttpException } from '@common/exceptions'
import { CreateProductRequestDto, UpdateProductRequestDto } from '@interface-adapter/dtos/products'
import { HttpStatus } from '@nestjs/common'

export function validateUniqueUnitNames(
  data: CreateProductRequestDto | UpdateProductRequestDto
): void {
  const names: string[] = []

  if (data.unitName) {
    names.push(data.unitName)
  }

  if (Array.isArray(data.variants)) {
    for (const variant of data.variants) {
      if (variant.unitName) {
        names.push(variant.unitName)
      }
    }
  }

  const normalized = names
    .filter(name => !!name && name.trim() !== '')
    .map(name => name.trim().toUpperCase())

  const duplicates = normalized.filter((name, index) => normalized.indexOf(name) !== index)

  if (duplicates.length > 0) {
    throw new HttpException(HttpStatus.CONFLICT, PRODUCT_ERROR.UNIT_NAME_ALREADY_EXISTS)
  }
}
