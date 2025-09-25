import { PartialType } from '@nestjs/swagger'
import { CreateSupplierRequestDto } from './create-supplier.dto'

export class UpdateSupplierRequestDto extends PartialType(CreateSupplierRequestDto) {}
