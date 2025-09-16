import { PaginationQueryDto } from '@common/dtos/pagination-query.dto'
import { PaginationResponseDto } from '@common/dtos/pagination-response.dto'
import { ProductGroup } from '@common/types'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsOptional, IsBoolean } from 'class-validator'

export class GetAllProductGroupRequestDto extends PaginationQueryDto {
  @IsOptional()
  @IsBoolean({ message: 'isParent là giá trị boolean' })
  @Transform(({ value }: TransformFnParams) => value === 'true' || value === true)
  isParent: boolean
}

export class GetAllProductGroupResponseDto extends PaginationResponseDto<ProductGroup> {
  constructor(partial: Partial<GetAllProductGroupResponseDto>) {
    super(partial)
  }
}
