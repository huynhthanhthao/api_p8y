import { PartialType } from '@nestjs/swagger'
import { CreateProductGroupRequestDto } from './create-product-group.dto'

export class UpdateProductGroupRequestDto extends PartialType(CreateProductGroupRequestDto) {}
