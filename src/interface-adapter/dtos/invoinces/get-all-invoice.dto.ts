import { PaginationQueryDto } from '@common/dtos/pagination-query.dto'
import { PaginationResponseDto } from '@common/dtos/pagination-response.dto'
import { Customer } from '@common/types'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsOptional, IsUUID } from 'class-validator'

export class GetAllCustomerRequestDto extends PaginationQueryDto {
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsUUID('4', { message: 'Id phải là uuid' })
  customerId: string
}

export class GetAllCustomerResponseDto extends PaginationResponseDto<Customer> {
  constructor(partial: Partial<GetAllCustomerResponseDto>) {
    super(partial)
  }
}
