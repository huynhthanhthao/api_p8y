import { PaginationQueryDto } from '@common/dtos/pagination-query.dto'
import { PaginationResponseDto } from '@common/dtos/pagination-response.dto'
import { StockCard } from '@common/types'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsOptional, IsUUID } from 'class-validator'

export class GetAllStockCardRequestDto extends PaginationQueryDto {
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsUUID('4', { message: 'Id phải là uuid' })
  productId: string
}

export class GetAllStockCardResponseDto extends PaginationResponseDto<StockCard> {
  constructor(partial: Partial<GetAllStockCardResponseDto>) {
    super(partial)
  }
}
