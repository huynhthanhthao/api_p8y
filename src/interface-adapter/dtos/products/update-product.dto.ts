import { PartialType } from '@nestjs/swagger'
import { CreateProductRequestDto } from './create-product.dto'
import { Product } from '@common/types'

export class UpdateProductRequestDto extends PartialType(CreateProductRequestDto) {}

export class UpdateProductResponseDto {
  constructor(entity: Product) {
    Object.assign(this, {
      entity
    })
  }
}
