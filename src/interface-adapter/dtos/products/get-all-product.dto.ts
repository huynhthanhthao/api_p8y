import { PaginationQueryDto } from '@common/dtos/pagination-query.dto'
import { PaginationResponseDto } from '@common/dtos/pagination-response.dto'
import { ProductTypeEnum } from '@common/enums/product.enum'
import { Product } from '@common/types'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsBoolean, IsOptional, IsUUID } from 'class-validator'

export class GetAllProductRequestDto extends PaginationQueryDto {
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => {
    return value?.split(',').map((id: string) => id.trim())
  })
  @IsUUID('4', { each: true, message: 'Id phải là uuid' })
  manufacturerIds: string[]

  @IsOptional()
  @Transform(({ value }: TransformFnParams) => {
    return value?.split(',').map((id: string) => id.trim())
  })
  @IsUUID('4', { each: true, message: 'Id phải là uuid' })
  productGroupIds: string[]

  @IsOptional()
  @Transform(({ value }: TransformFnParams) => {
    return value?.split(',').map((id: ProductTypeEnum) => id.trim())
  })
  @IsUUID('4', {
    each: true,
    message: `Loại sản phẩm phải là một trong: ${Object.values(ProductTypeEnum).join(', ')}`
  })
  types: ProductTypeEnum[]

  @IsOptional()
  @IsBoolean({ message: 'isDirectSale là giá trị boolean' })
  @Transform(({ value }: TransformFnParams) => value === 'true' || value === true)
  isDirectSale: boolean

  @IsOptional()
  @IsBoolean({ message: 'isParent là giá trị boolean' })
  @Transform(({ value }: TransformFnParams) => value === 'true' || value === true)
  isParent: boolean
}

export class GetAllProductResponseDto extends PaginationResponseDto<Product> {
  constructor(partial: Partial<GetAllProductResponseDto>) {
    super(partial)
  }
}
