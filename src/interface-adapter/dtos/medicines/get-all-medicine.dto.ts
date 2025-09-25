import { PaginationQueryDto } from '@common/dtos/pagination-query.dto'
import { PaginationResponseDto } from '@common/dtos/pagination-response.dto'
import { Medicine } from '@common/types'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsOptional, IsInt, Min, Max } from 'class-validator'

export class GetAllMedicineRequestDto extends PaginationQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Transform(({ value }: TransformFnParams) => parseInt(value, 10))
  perPage: number = 20
}

export class GetAllMedicineResponseDto extends PaginationResponseDto<Medicine> {
  constructor(partial: Partial<GetAllMedicineResponseDto>) {
    super(partial)
  }
}
