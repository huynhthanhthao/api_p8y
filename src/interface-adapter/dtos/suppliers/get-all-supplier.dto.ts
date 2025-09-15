import { PaginationQueryDto } from '@common/dtos/pagination-query.dto'
import { PaginationResponseDto } from '@common/dtos/pagination-response.dto'
import { Supplier } from '@common/types'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsOptional, IsUUID } from 'class-validator'

export class GetAllSupplierRequestDto extends PaginationQueryDto {
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => {
    return value?.split(',').map((id: string) => id.trim())
  })
  @IsUUID('4', { each: true, message: 'Id phải là uuid' })
  supplierGroupIds: string[]
}

export class GetAllSupplierResponseDto extends PaginationResponseDto<Supplier> {
  constructor(partial: Partial<GetAllSupplierResponseDto>) {
    super(partial)
  }
}
