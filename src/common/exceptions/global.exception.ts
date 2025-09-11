import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'
import { Response } from 'express'
import { Prisma } from '@prisma/client'
import { ErrorResponse } from '../interfaces'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    console.error(exception)

    let statusCode = 400
    let errorCode = 'ERR_BAD_REQUEST' // Giá trị mặc định
    let message = 'Có lỗi xảy ra'
    let errors: string[] = []

    // Xử lý lỗi Prisma
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      statusCode = HttpStatus.BAD_REQUEST
      errorCode = 'ERR_DATABASE'

      switch (exception.code) {
        case 'P2002':
          message = 'Dữ liệu đã tồn tại trong hệ thống'
          errors = ['Trùng lặp dữ liệu']
          errorCode = 'ERR_DUPLICATE_DATA'
          break
        case 'P2003':
          message = 'Dữ liệu tham chiếu không hợp lệ'
          errors = ['Dữ liệu tham chiếu không tồn tại']
          errorCode = 'ERR_FOREIGN_KEY'
          break
        case 'P2025':
          message = 'Không tìm thấy dữ liệu'
          errors = ['Bản ghi không tồn tại']
          errorCode = 'ERR_RECORD_NOT_FOUND'
          break
        default:
          message = 'Lỗi xử lý dữ liệu'
          errors = ['Lỗi cơ sở dữ liệu']
          errorCode = 'ERR_FROM_DATABASE'
      }
    }
    // Xử lý HttpException (bao gồm validation errors)
    else if (exception instanceof HttpException) {
      statusCode = exception.getStatus()
      const exceptionResponse = exception.getResponse()

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any

        if (Array.isArray(responseObj.errors)) {
          errors = responseObj.errors
        } else if (Array.isArray(responseObj.message)) {
          errors = responseObj.message
        } else if (responseObj.message) {
          message = responseObj.message
        }

        if (responseObj.errorCode) {
          errorCode = responseObj.errorCode
        }
      }
    }

    response.status(statusCode).json({
      message,
      errorCode,
      errors
    })
  }
}
