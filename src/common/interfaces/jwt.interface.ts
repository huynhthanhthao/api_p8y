import { UserTypeEnum } from '@common/enums'

export interface RequestAccessBranchJWT extends Request {
  userId: string
  storeCode: string
  branchId: string
}

export interface SignInDecodeJWT {
  userId: string
  storeCode: string
}

export interface AccessBranchDecodeJWT {
  branchId: string
  userId: string
  storeCode: string
  userType: UserTypeEnum
  permissionCodes: string[]
}

export interface RefreshTokenDecodeJWT {
  branchId: string
  userId: string
  storeCode: string
}
