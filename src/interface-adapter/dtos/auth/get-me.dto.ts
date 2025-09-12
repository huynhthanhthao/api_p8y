import { StoreWithBranches, UserBasicInfo } from '@common/types'
import { Branch } from '@common/types/branch.type'

export class GetMeResponseDto {
  currentBranch: Branch
  store: StoreWithBranches
  user: UserBasicInfo
}
