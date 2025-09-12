import { Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { getUserInfo } from '@common/utils/get-user-info.util'
import { UserTypeEnum } from '@common/enums'
import { getStoreWithAccessibleBranches } from '@common/utils'
import { Branch } from '@common/types'
import { GetMeResponseDto } from '@interface-adapter/dtos/auth'

@Injectable()
export class GetMeUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, branchId: string, storeCode: string): Promise<GetMeResponseDto> {
    const user = await getUserInfo(this.prisma, userId)

    const accessUserId = user.type === UserTypeEnum.SUPER_ADMIN ? undefined : user.id

    const store = await getStoreWithAccessibleBranches(this.prisma, storeCode, accessUserId)

    const currentBranch = await this.getBranchById(branchId)

    return {
      currentBranch,
      store,
      user
    }
  }

  private async getBranchById(branchId: string): Promise<Branch> {
    return this.prisma.branch.findUniqueOrThrow({
      where: {
        id: branchId
      }
    })
  }
}
