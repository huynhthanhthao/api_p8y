import { PartialType } from '@nestjs/swagger'
import { CreateCustomerGroupRequestDto } from './create-customer-group.dto'
import { CustomerGroup } from '@common/types'

export class UpdateCustomerGroupRequestDto extends PartialType(CreateCustomerGroupRequestDto) {}

export class UpdateCustomerGroupResponseDto {
  constructor(entity: CustomerGroup) {
    Object.assign(this, {
      entity
    })
  }
}
