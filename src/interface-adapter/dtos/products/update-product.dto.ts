import { PartialType } from '@nestjs/swagger'
import { CreateProductRequestDto } from './create-product.dto'

export class UpdateProductRequestDto extends PartialType(CreateProductRequestDto) {}
