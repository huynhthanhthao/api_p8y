import { PartialType } from '@nestjs/swagger'
import { CreateCustomerRequestDto } from './create-customer.dto'

export class UpdateCustomerRequestDto extends PartialType(CreateCustomerRequestDto) {}
