import * as bcrypt from 'bcrypt'
import { PrismaService } from '@infrastructure/prisma'
import { HttpStatus, Injectable } from '@nestjs/common'
import { HttpException } from '@common/exceptions'
import { UpdateUserRequestDto } from '@interface-adapter/dtos/users'
import { USER_ERROR } from '@common/errors'
import { User } from '@common/types'
import { USER_SELECT_FIELDS } from '@common/constants'

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    id: string,
    data: UpdateUserRequestDto,
    userId: string,
    storeCode: string
  ): Promise<User> {
    const user = await this.prismaClient.user.findUnique({
      where: {
        id: id,
        storeCode
      }
    })

    if (!user) {
      throw new HttpException(HttpStatus.CONFLICT, USER_ERROR.USER_NOT_FOUND)
    }

    /**
     * Kiểm tra unique fields
     * Kiểm tra chi nhánh thuộc shop không
     */
    if (data.branchIds && !data.branchIds.length)
      await this.branchesBelongToShop(data.branchIds, storeCode)

    await this.validateUniqueFields(data, storeCode, id)

    return this.prismaClient.user.update({
      where: {
        id: id,
        storeCode
      },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        type: data.type,
        status: data.status,
        address: data.address,
        avatarId: data.avatarId,
        ...(data.password && {
          password: await bcrypt.hash(data.password, 10)
        }),
        provinceCode: data.provinceCode,
        wardCode: data.wardCode,
        ...(data.roleIds && {
          roles: {
            set: data.roleIds.map(id => ({ id }))
          }
        }),
        ...(data.branchIds && {
          branches: {
            set: data.branchIds.map(id => ({ id }))
          }
        }),
        updatedBy: userId
      },
      ...USER_SELECT_FIELDS
    })
  }

  private async validateUniqueFields(
    data: UpdateUserRequestDto,
    storeCode: string,
    currentId: string
  ): Promise<void> {
    const existingUser = await this.prismaClient.user.findFirst({
      where: {
        id: {
          not: currentId
        },
        OR: [
          {
            phone: data.phone
          },
          {
            email: data.email
          }
        ],
        storeCode
      },
      select: {
        phone: true,
        email: true
      }
    })

    if (existingUser) {
      if (data.phone && existingUser.phone === data.phone) {
        throw new HttpException(HttpStatus.CONFLICT, USER_ERROR.PHONE_ALREADY_EXISTS)
      }

      if (data.email && existingUser.email === data.email) {
        throw new HttpException(HttpStatus.CONFLICT, USER_ERROR.EMAIL_ALREADY_EXISTS)
      }
    }
  }

  private async branchesBelongToShop(branchIds: string[], storeCode: string): Promise<void> {
    const branches = await this.prismaClient.branch.findMany({
      where: {
        id: {
          in: branchIds
        },
        storeCode
      },
      select: {
        id: true
      }
    })

    if (branches.length !== branchIds.length)
      throw new HttpException(HttpStatus.BAD_REQUEST, USER_ERROR.SOME_BRANCHES_NOT_FOUND)
  }
}
