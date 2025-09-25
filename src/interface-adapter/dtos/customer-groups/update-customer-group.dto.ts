import { PartialType } from '@nestjs/swagger'
import { CreateCustomerGroupRequestDto } from './create-customer-group.dto'

export class UpdateCustomerGroupRequestDto extends PartialType(CreateCustomerGroupRequestDto) {}
