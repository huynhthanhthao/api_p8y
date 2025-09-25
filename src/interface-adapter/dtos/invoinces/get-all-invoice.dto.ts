import { PaginationQueryDto } from '@common/dtos/pagination-query.dto'
import { PaginationResponseDto } from '@common/dtos/pagination-response.dto'
import { Invoice } from '@common/types'
import { Transform, TransformFnParams, Type } from 'class-transformer'
import { IsDate, IsOptional, IsUUID } from 'class-validator'

export class GetAllInvoiceRequestDto extends PaginationQueryDto {
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsUUID('4', { message: 'Id phải là uuid' })
  customerId: string

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

export class GetAllInvoiceResponseDto extends PaginationResponseDto<Invoice> {
  constructor(partial: Partial<GetAllInvoiceResponseDto>) {
    super(partial)
  }
}
