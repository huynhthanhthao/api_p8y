import { PartialType } from '@nestjs/swagger'
import { Supplier } from '@common/types'
import { CreateSupplierRequestDto } from './create-supplier.dto'

export class UpdateSupplierRequestDto extends PartialType(CreateSupplierRequestDto) {}

export class UpdateSupplierResponseDto {
  constructor(entity: Supplier) {
    Object.assign(this, {
      entity
    })
  }
}
