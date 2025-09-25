import { PaginationQueryDto } from '@common/dtos/pagination-query.dto'
import { PaginationResponseDto } from '@common/dtos/pagination-response.dto'
import { PaymentMethod } from '@common/types'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsOptional, IsBoolean } from 'class-validator'

export class GetAllPaymentMethodRequestDto extends PaginationQueryDto {
  @IsOptional()
  @IsBoolean({ message: 'isActive là giá trị boolean' })
  @Transform(({ value }: TransformFnParams) => value === 'true' || value === true)
  isActive: boolean
}

export class GetAllPaymentMethodResponseDto extends PaginationResponseDto<PaymentMethod> {
  constructor(partial: Partial<GetAllPaymentMethodResponseDto>) {
    super(partial)
  }
}
