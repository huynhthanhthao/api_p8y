import { PartialType } from '@nestjs/swagger'
import { CreateProductLotRequestDto } from './create-product-lot.dto'

export class UpdateProductLotRequestDto extends PartialType(CreateProductLotRequestDto) {}
