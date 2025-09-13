import { Transform, TransformFnParams } from 'class-transformer'
import { ArrayNotEmpty, IsNotEmpty } from 'class-validator'

export class DeleteManyQueryDto {
  @IsNotEmpty({ message: 'Danh sách ID không để trống' })
  @Transform(({ value }: TransformFnParams) => {
    return value?.split(',').map((id: string) => id.trim())
  })
  @ArrayNotEmpty({ message: 'Danh sách ID không để trống' })
  ids: string[]
}
