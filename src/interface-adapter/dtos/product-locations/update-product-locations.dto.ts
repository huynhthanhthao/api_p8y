import { PartialType } from '@nestjs/swagger'
import { ProductLocation } from '@common/types'
import { CreateProductLocationRequestDto } from './create-product-locations.dto'

export class UpdateProductLocationRequestDto extends PartialType(CreateProductLocationRequestDto) {}

export class UpdateProductLocationResponseDto {
  constructor(entity: ProductLocation) {
    Object.assign(this, {
      entity
    })
  }
}
