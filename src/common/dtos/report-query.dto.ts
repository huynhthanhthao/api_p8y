import { ReportGroupByEnum } from '@common/enums'
import { Transform, Type } from 'class-transformer'
import { IsDate, IsEnum, IsOptional } from 'class-validator'

export class ReportQueryDto {
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

  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsEnum(ReportGroupByEnum, {
    message: `groupBy là một trong: ${Object.values(ReportGroupByEnum).join(', ')}`
  })
  groupBy: ReportGroupByEnum = ReportGroupByEnum.DAY
}
