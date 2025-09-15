import { ArrayNotEmpty, IsNotEmpty } from 'class-validator'

export class DeleteManyRequestDto {
  @IsNotEmpty({ message: 'Danh sách ID không để trống' })
  @ArrayNotEmpty({ message: 'Danh sách ID không để trống' })
  ids: string[]
}
