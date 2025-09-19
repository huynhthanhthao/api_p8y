import { Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { getUserInfo } from '@common/utils/auth/get-user-info.util'
import { UserTypeEnum } from '@common/enums'
import { getStoreWithAccessibleBranches } from '@common/utils'
import { Branch } from '@common/types'
import { GetMeResponseDto } from '@interface-adapter/dtos/auth'

@Injectable()
export class GetMeUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(userId: string, branchId: string, storeCode: string): Promise<GetMeResponseDto> {
    const user = await getUserInfo(this.prismaClient, userId)

    const accessUserId = user.type === UserTypeEnum.SUPER_ADMIN ? undefined : user.id

    const store = await getStoreWithAccessibleBranches(this.prismaClient, storeCode, accessUserId)

    const currentBranch = await this.getBranchById(branchId)

    return {
      currentBranch,
      store,
      user
    }
  }

  private async getBranchById(branchId: string): Promise<Branch> {
    return this.prismaClient.branch.findUniqueOrThrow({
      where: {
        id: branchId
      },
      omit: {
        deletedAt: true,
        deletedBy: true,
        createdBy: true,
        createdAt: true,
        updatedAt: true,
        updatedBy: true
      },
      include: {
        province: true,
        ward: true
      }
    })
  }
}
