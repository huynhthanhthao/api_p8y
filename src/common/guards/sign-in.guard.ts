import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { ACCESS_BRANCH_ERROR, GUARD_ERROR } from 'src/common/errors'
import { HttpException } from '../exceptions'
import { LoginDecodeJWT } from '../interfaces'

@Injectable()
export class SignInGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers.authorization

    if (!authHeader) {
      throw new HttpException(HttpStatus.NOT_FOUND, GUARD_ERROR.TOKEN_REQUIRED)
    }

    const token = this.extractTokenFromHeader(authHeader)

    if (!token) {
      throw new HttpException(HttpStatus.BAD_REQUEST, GUARD_ERROR.INVALID_TOKEN)
    }

    try {
      const decoded: LoginDecodeJWT = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET_KEY_SIGNUP
      })

      console.log(decoded, 123)

      request.storeCode = decoded.storeCode
      request.userId = decoded.userId

      return true
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new HttpException(HttpStatus.UNAUTHORIZED, GUARD_ERROR.TOKEN_EXPIRED)
      } else if (error.name === 'JsonWebTokenError') {
        throw new HttpException(HttpStatus.UNAUTHORIZED, GUARD_ERROR.INVALID_TOKEN)
      } else {
        throw new HttpException(HttpStatus.UNAUTHORIZED, GUARD_ERROR.TOKEN_VERIFICATION_FAILED)
      }
    }
  }

  private extractTokenFromHeader(authHeader: string): string {
    const parts = authHeader.split(' ')

    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
      throw new HttpException(HttpStatus.BAD_REQUEST, GUARD_ERROR.INVALID_TOKEN)
    }

    return parts[1]
  }
}
