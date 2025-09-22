import * as bcrypt from 'bcrypt'
import { User } from '@common/types'
import { PrismaService } from '@infrastructure/prisma'
import { HttpStatus, Injectable } from '@nestjs/common'
import { HttpException } from '@common/exceptions'
import { CreateUserRequestDto } from '@interface-adapter/dtos/users'
import { USER_ERROR } from '@common/errors'
import { USER_SELECT_FIELDS } from '@common/constants'

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(data: CreateUserRequestDto, userId: string, storeCode: string): Promise<User> {
    /**
     * Kiểm tra unique fields
     * Kiểm tra chi nhánh thuộc shop không
     */
    await this.validateUniqueFields(data, storeCode)

    await this.branchesBelongToShop(data.branchIds, storeCode)

    return await this.prismaClient.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        type: data.type,
        status: data.status,
        address: data.address,
        avatarId: data.avatarId,
        password: await bcrypt.hash(data.password, 10),
        storeCode,
        createdBy: userId,
        provinceCode: data.provinceCode,
        wardCode: data.wardCode,
        ...(data.roleIds && {
          roles: {
            connect: data.roleIds.map(id => ({ id }))
          }
        }),
        ...(data.branchIds && {
          branches: {
            connect: data.branchIds.map(id => ({ id }))
          }
        })
      },
      ...USER_SELECT_FIELDS
    })
  }

  private async validateUniqueFields(data: CreateUserRequestDto, storeCode: string): Promise<void> {
    const existingUser = await this.prismaClient.user.findFirst({
      where: {
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
