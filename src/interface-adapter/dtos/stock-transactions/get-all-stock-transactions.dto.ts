import { PaginationQueryDto } from '@common/dtos/pagination-query.dto'
import { PaginationResponseDto } from '@common/dtos/pagination-response.dto'
import { StockTransactionTypeEnum } from '@common/enums'
import { StockTransaction } from '@common/types'
import { Transform, TransformFnParams, Type } from 'class-transformer'
import { IsDate, IsEnum, IsOptional, IsUUID } from 'class-validator'

export class GetAllStockTransactionRequestDto extends PaginationQueryDto {
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => {
    return value?.split(',').map((id: string) => id.trim())
  })
  @IsUUID('4', { each: true, message: 'Id phải là uuid' })
  supplierGroupIds: string[]

  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsEnum(StockTransactionTypeEnum)
  type: StockTransactionTypeEnum

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Transform(({ value }) => {
    const date = new Date(value)
    return new Date(date.setHours(0, 0, 0, 0))
  })
  from: Date

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Transform(({ value }) => {
    const date = new Date(value)
    return new Date(date.setHours(23, 59, 59, 999))
  })
  to: Date
}

export class GetAllStockTransactionResponseDto extends PaginationResponseDto<StockTransaction> {
  constructor(partial: Partial<GetAllStockTransactionResponseDto>) {
    super(partial)
  }
}
