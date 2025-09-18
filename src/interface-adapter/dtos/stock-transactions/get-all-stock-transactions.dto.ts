import { PaginationQueryDto } from '@common/dtos/pagination-query.dto'
import { PaginationResponseDto } from '@common/dtos/pagination-response.dto'
import { StockTransactionType } from '@common/enums'
import { StockTransaction } from '@common/types'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsEnum, IsOptional, IsUUID } from 'class-validator'

export class GetAllStockTransactionRequestDto extends PaginationQueryDto {
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => {
    return value?.split(',').map((id: string) => id.trim())
  })
  @IsUUID('4', { each: true, message: 'Id phải là uuid' })
  supplierGroupIds: string[]

  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsEnum(StockTransactionType)
  type: StockTransactionType
}

export class GetAllStockTransactionResponseDto extends PaginationResponseDto<StockTransaction> {
  constructor(partial: Partial<GetAllStockTransactionResponseDto>) {
    super(partial)
  }
}
