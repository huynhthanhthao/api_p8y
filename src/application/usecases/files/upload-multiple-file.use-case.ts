import { FileTypeEnum } from '@common/enums/file.enum'
import { FILE_ERROR } from '@common/errors'
import { HttpException } from '@common/exceptions'
import { File } from '@common/types'
import { PrismaService } from '@infrastructure/prisma'
import { HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as fs from 'fs'
import * as path from 'path'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class UploadMultipleFileUseCase {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService
  ) {}

  private get prismaClient() {
    return this.prismaService.client
  }

  async execute(files: Express.Multer.File[]): Promise<File[]> {
    try {
      // Validate input
      if (!files || files.length === 0) {
        throw new HttpException(HttpStatus.BAD_REQUEST, FILE_ERROR.FILE_NOT_FOUND)
      }

      const uploadDir = this.configService.get<string>('FILE_UPLOAD_DIR') || './uploads'

      // Ensure upload directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }

      // Process each file and prepare data for database
      const fileRecords = await Promise.all(
        files.map(async file => {
          // Generate unique filename
          const fileExtension = path.extname(file.originalname)
          const uniqueFilename = `${uuidv4()}${fileExtension}`
          const filePath = path.join(uploadDir, uniqueFilename)

          // Save file to disk
          fs.writeFileSync(filePath, file.buffer)

          return {
            filename: uniqueFilename,
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            path: filePath,
            type: this.determineFileType(file.mimetype)
          }
        })
      )

      // Create file records in database
      await this.prismaClient.file.createMany({
        data: fileRecords,
        skipDuplicates: true
      })

      // Return the created files with their IDs
      return await this.prismaClient.file.findMany({
        where: {
          filename: {
            in: fileRecords.map(record => record.filename)
          }
        }
      })
    } catch (error) {
      throw new Error(`Failed to upload multiple files: ${error.message}`)
    }
  }

  private determineFileType(mimetype: string): FileTypeEnum {
    if (mimetype.startsWith('image/')) {
      return FileTypeEnum.IMAGE
    } else if (mimetype.startsWith('video/')) {
      return FileTypeEnum.VIDEO
    } else {
      return FileTypeEnum.OTHER
    }
  }
}
