import { AnyObject } from './any-object.interface'

export interface ErrorResponse {
  errorCode: string
  message: string
  errors?: AnyObject
}
