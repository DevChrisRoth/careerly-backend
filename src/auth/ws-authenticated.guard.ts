import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma_config/prisma.service';

@Injectable()
export class WsAuthenticatedGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    //must send userid and type and parse it to json string
    //chech with session from sessions table

    const request = context.switchToWs().getClient();
    const { userid, type } = request.handshake.auth;
    const jsonQuery = JSON.stringify({ type, userid });
    const res = await this.prisma.$queryRaw<any[]>(
      Prisma.sql`SELECT session_id FROM sessions where data like ${`%${jsonQuery}%`}`,
    );
    if (res.length === 0) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Bitte logge dich erst ein',
      });
    }
    return true;
  }
}
