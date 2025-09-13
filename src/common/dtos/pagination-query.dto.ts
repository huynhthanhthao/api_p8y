import { SortByEnum, SortOrderEnum } from '@common/enums/sort.enum'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator'

export class PaginationQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }: TransformFnParams) => parseInt(value, 10))
  page: number = 1

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }: TransformFnParams) => parseInt(value, 10))
  perPage: number = 20

  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  keyword: string

  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsEnum(SortByEnum)
  sortBy: SortByEnum = SortByEnum.CREATED_AT

  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsEnum(SortOrderEnum)
  orderBy: SortOrderEnum = SortOrderEnum.DESC
}
