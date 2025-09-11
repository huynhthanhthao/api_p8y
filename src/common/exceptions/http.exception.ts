import { HttpException as NestHttpException } from '@nestjs/common'
import { AnyObject, ErrorResponse } from '../interfaces'

export class HttpException extends NestHttpException {
  constructor(status: number, errorDef: { code: string; message: string }, errors?: AnyObject) {
    const response: ErrorResponse = {
      errorCode: errorDef.code,
      message: errorDef.message,
      errors
    }

    super(response, status)
  }
}
