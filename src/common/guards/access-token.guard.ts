import { JwtService } from '@nestjs/jwt'
import { HttpException } from '../exceptions'
import { AccessBranchDecodeJWT } from '../interfaces'
import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common'
import { GUARD_ERROR } from '@common/errors'

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers.authorization

    if (!authHeader) {
      throw new HttpException(HttpStatus.UNAUTHORIZED, GUARD_ERROR.TOKEN_REQUIRED)
    }

    const token = this.extractTokenFromHeader(authHeader)

    if (!token) {
      throw new HttpException(HttpStatus.UNAUTHORIZED, GUARD_ERROR.INVALID_TOKEN)
    }

    try {
      const decoded: AccessBranchDecodeJWT = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET_KEY_ACCESS
      })

      request.branchId = decoded.branchId
      request.userId = decoded.userId
      request.storeCode = decoded.storeCode
      request.permissionCodes = decoded.permissionCodes
      request.userType = decoded.userType

      return true
    } catch (error) {
      this.handleJWTError(error)
    }
  }

  private extractTokenFromHeader(authHeader: string): string {
    const parts = authHeader.split(' ')

    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
      throw new HttpException(HttpStatus.UNAUTHORIZED, GUARD_ERROR.INVALID_TOKEN)
    }

    return parts[1]
  }

  private handleJWTError(error: any): never {
    if (error.name === 'TokenExpiredError') {
      throw new HttpException(HttpStatus.UNAUTHORIZED, GUARD_ERROR.TOKEN_EXPIRED)
    } else if (error.name === 'JsonWebTokenError') {
      throw new HttpException(HttpStatus.UNAUTHORIZED, GUARD_ERROR.INVALID_TOKEN)
    } else {
      throw new HttpException(HttpStatus.UNAUTHORIZED, GUARD_ERROR.TOKEN_VERIFICATION_FAILED)
    }
  }
}
