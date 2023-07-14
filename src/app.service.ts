import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma_config/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}
  getHello(): string {
    return 'Hello World!';
  }

  test() {
    this.prisma.career.findMany().then((res) => {
      console.log(res);
    });
  }
}
