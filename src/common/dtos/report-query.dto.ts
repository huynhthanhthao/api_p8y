import { SortByEnum, SortOrderEnum } from '@common/enums/sort.enum'
import { Transform, TransformFnParams, Type } from 'class-transformer'
import { IsBoolean, IsDate, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator'

export class PaginationQueryDto {
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
