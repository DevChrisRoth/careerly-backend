import { Injectable } from '@nestjs/common';
import * as bycript from 'bcryptjs';
import { PrismaService } from 'src/prisma_config/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async validateUser(email: string, _password: string) {
    const user = await this.findByUsernameAndPassword(email);
    if (user.status === 'failed') {
      return null;
    } else {
      if (user && bycript.compareSync(_password, user.userlogin.password)) {
        await this.updateLastLogin(user.userlogin.userloginId);
        const { email, password, ...result } = user.userlogin;
        return { userid: result.userloginId };
      }
    }
    return null;
  }

  private async findByUsernameAndPassword(_email: string) {
    try {
      const d = await this.prisma.userlogin.findFirst({
        select: {
          userloginId: true,
          email: true,
          password: true,
        },
        where: {
          email: _email,
        },
      });
      let status = 'failed';
      if (d.email !== '') {
        status = 'success';
      }
      return { status, userlogin: d };
    } catch (error) {
      return { status: 'failed' };
    }
  }

  private async updateLastLogin(userloginId: number) {
    await this.prisma.userlogin.update({
      where: {
        userloginId,
      },
      data: {
        updatedAt: new Date(),
      },
    });
  }
}
