import { File } from '@common/types'
import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { UploadMultipleFileUseCase } from '@usecases/files'
import * as multer from 'multer'

@Controller('files')
export class FileController {
  constructor(private readonly _uploadMultipleFileUseCase: UploadMultipleFileUseCase) {}

  @Post('upload-multiple')
  @UseInterceptors(
    FilesInterceptor('contents', 10, {
      storage: multer.memoryStorage(),
      limits: {
        files: 10,
        fileSize: 1024 * 1024 * 10
      }
    })
  )
  async multipleFile(@UploadedFiles() files: Express.Multer.File[]): Promise<File[]> {
    return this._uploadMultipleFileUseCase.execute(files)
  }
}
