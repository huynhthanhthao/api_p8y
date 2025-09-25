import { PartialType } from '@nestjs/swagger'
import { CreateSupplierGroupRequestDto } from './create-supplier-group.dto'

export class UpdateSupplierGroupRequestDto extends PartialType(CreateSupplierGroupRequestDto) {}
