import { PartialType } from '@nestjs/swagger'
import { CreateCustomerRequestDto } from './create-customer.dto'
import { Customer } from '@common/types'

export class UpdateCustomerRequestDto extends PartialType(CreateCustomerRequestDto) {}

export class UpdateCustomerResponseDto {
  constructor(entity: Customer) {
    Object.assign(this, {
      entity
    })
  }
}
