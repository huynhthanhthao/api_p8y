import { PartialType } from '@nestjs/swagger'
import { CreateProductLocationRequestDto } from './create-product-locations.dto'

export class UpdateProductLocationRequestDto extends PartialType(CreateProductLocationRequestDto) {}
