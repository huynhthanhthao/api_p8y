import { IsNotEmpty, IsUUID } from 'class-validator'
import { StoreWithBranches, UserBasicInfo } from '@common/types'
import { Branch } from '@common/types/branch.type'

export class AccessBranchRequestDto {
  @IsNotEmpty({ message: 'Chi nhánh không được để trống' })
  @IsUUID(undefined, { message: 'ID chi nhánh phải là định dạng UUID' })
  branchId: string
}

export class AccessBranchResponseDto {
  currentBranch: Branch
  store: StoreWithBranches
  accessToken: string
  refreshToken: string
  user: UserBasicInfo
}
