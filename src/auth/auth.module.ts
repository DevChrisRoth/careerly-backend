import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'src/prisma_config/prisma.service';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './session.serializer';

@Module({
  imports: [PassportModule.register({ session: true })],
  exports: [AuthService],
  providers: [AuthService, LocalStrategy, SessionSerializer, PrismaService],
})
export class AuthModule {}
