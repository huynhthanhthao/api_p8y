import { SortByEnum, SortOrderEnum } from '@common/enums/sort.enum'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator'

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
  @IsEnum(SortByEnum, {
    message: `Trường sắp xếp phải là một trong: ${Object.values(SortByEnum).join(', ')}`
  })
  sortBy: SortByEnum = SortByEnum.CREATED_AT

  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsEnum(SortOrderEnum, {
    message: `Kiểu sắp xếp phải là một trong: ${Object.values(SortOrderEnum).join(', ')}`
  })
  orderBy: SortOrderEnum = SortOrderEnum.DESC
}
