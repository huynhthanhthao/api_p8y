import { PaginationQueryDto } from '@common/dtos/pagination-query.dto'
import { PaginationResponseDto } from '@common/dtos/pagination-response.dto'
import { ProductLot } from '@common/types'
import { Transform, TransformFnParams, Type } from 'class-transformer'
import { IsOptional, IsBoolean, IsInt, Min, IsUUID, IsDate } from 'class-validator'

export class GetAllProductLotRequestDto extends PaginationQueryDto {
  @IsOptional()
  @IsBoolean({ message: 'isExpired phải là giá trị boolean' })
  @Transform(({ value }: TransformFnParams) => value === 'true' || value === true)
  isExpired: boolean

  @IsOptional()
  @IsInt({ message: 'Giá trị minStockQuantity phải là số nguyên' })
  @Min(0)
  @Transform(({ value }: TransformFnParams) => parseInt(value, 10))
  quantityGreaterThan: number

  @IsOptional()
  @IsUUID('4', { message: 'ID nhóm cha phải là UUID hợp lệ' })
  productId: string

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Transform(({ value }) => {
    const date = new Date(value)
    return new Date(date.setHours(0, 0, 0, 0))
  })
  expiryFrom: Date

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Transform(({ value }) => {
    const date = new Date(value)
    return new Date(date.setHours(23, 59, 59, 999))
  })
  expiryTo: Date
}

export class GetAllProductLotResponseDto extends PaginationResponseDto<ProductLot> {
  constructor(partial: Partial<GetAllProductLotResponseDto>) {
    super(partial)
  }
}
