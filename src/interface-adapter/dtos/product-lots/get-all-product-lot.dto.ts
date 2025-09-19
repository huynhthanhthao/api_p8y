import { PaginationQueryDto } from '@common/dtos/pagination-query.dto'
import { PaginationResponseDto } from '@common/dtos/pagination-response.dto'
import { ProductLot } from '@common/types'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsOptional, IsBoolean, IsInt, Min, IsNotEmpty, IsUUID } from 'class-validator'

export class GetAllProductLotRequestDto extends PaginationQueryDto {
  @IsOptional()
  @IsBoolean({ message: 'isExpired phải là giá trị boolean' })
  @Transform(({ value }: TransformFnParams) => value === 'true' || value === true)
  isExpired: boolean

  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }: TransformFnParams) => parseInt(value, 10))
  minStockQuantity: number = 0

  @IsOptional()
  @IsUUID('4', { message: 'ID nhóm cha phải là UUID hợp lệ' })
  productId: string
}

export class GetAllProductLotResponseDto extends PaginationResponseDto<ProductLot> {
  constructor(partial: Partial<GetAllProductLotResponseDto>) {
    super(partial)
  }
}
