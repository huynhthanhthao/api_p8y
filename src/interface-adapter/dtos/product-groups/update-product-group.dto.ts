import { PartialType } from '@nestjs/swagger'
import { ProductGroup } from '@common/types'
import { CreateProductGroupRequestDto } from './create-product-group.dto'

export class UpdateProductGroupRequestDto extends PartialType(CreateProductGroupRequestDto) {}

export class UpdateProductGroupResponseDto {
  constructor(entity: ProductGroup) {
    Object.assign(this, {
      entity
    })
  }
}
