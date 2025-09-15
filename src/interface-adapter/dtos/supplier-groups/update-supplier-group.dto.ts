import { PartialType } from '@nestjs/swagger'
import { SupplierGroup } from '@common/types'
import { CreateSupplierGroupRequestDto } from './create-supplier-group.dto'

export class UpdateSupplierGroupRequestDto extends PartialType(CreateSupplierGroupRequestDto) {}

export class UpdateSupplierGroupResponseDto {
  constructor(entity: SupplierGroup) {
    Object.assign(this, {
      entity
    })
  }
}
