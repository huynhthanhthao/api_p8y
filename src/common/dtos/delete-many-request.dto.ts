import { ArrayNotEmpty } from 'class-validator'

export class DeleteManyRequestDto {
  @ArrayNotEmpty({ message: 'Danh sách ID không để trống' })
  ids: string[]
}
