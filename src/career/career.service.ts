import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma_config/prisma.service';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';

@Injectable()
export class CareerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCareerDto: CreateCareerDto, userId: number) {
    try {
      await this.prisma.career.create({
        data: {
          jobTitle: createCareerDto.jobTitle,
          jobDesc: createCareerDto.jobDesc,
          companyName: createCareerDto.companyName,
          timeFrom: createCareerDto.timeFrom,
          timeTo: createCareerDto.timeTo,
          userlogin: {
            connect: {
              userloginId: userId,
            },
          },
        },
      });
    } catch (error) {
      throw new HttpException(
        {
          message:
            'Es ist ein Fehler bei der Erstellung des Karriereeintrags aufgetreten. Bitte versuche es später erneut.',
        },
        500,
      );
    }
  }

  async findAll(username: string) {
    try {
      const user = await this.prisma.userconfig.findFirst({
        where: {
          name: username,
        },
        include: {
          userlogin: true,
        },
      });
      const career = await this.prisma.career.findMany({
        where: {
          userlogin: {
            userloginId: user.userlogin.userloginId,
          },
        },
        orderBy: {
          timeFrom: 'desc',
        },
      });
      return career;
    } catch (error) {
      throw new HttpException(
        {
          message:
            'Es ist ein Fehler beim Abrufen der Karrieredaten aufgetreten. Bitte versuche es später erneut.',
        },
        500,
      );
    }
  }

  findOne(id: number) {
    try {
      return this.prisma.career.findUnique({
        where: {
          careerId: id,
        },
      });
    } catch (error) {
      throw new HttpException(
        {
          message:
            'Es ist ein Fehler beim Abrufen des Karriereeintrags aufgetreten. Bitte versuche es später erneut.',
        },
        500,
      );
    }
  }

  async update(id: number, updateCareerDto: UpdateCareerDto, userId: number) {
    try {
      await this.prisma.career.update({
        where: {
          careerId: id,
        },
        data: {
          jobTitle: updateCareerDto.jobTitle,
          jobDesc: updateCareerDto.jobDesc,
          companyName: updateCareerDto.companyName,
          timeFrom: updateCareerDto.timeFrom,
          timeTo: updateCareerDto.timeTo,
          userlogin: {
            connect: {
              userloginId: userId,
            },
          },
        },
      });
    } catch (error) {
      throw new HttpException(
        {
          message:
            'Es ist ein Fehler beim Aktualisieren des Karriereeintrags aufgetreten. Bitte versuche es später erneut.',
        },
        500,
      );
    }
  }

  async remove(id: number, userId: number) {
    try {
      await this.prisma.career.deleteMany({
        where: {
          AND: {
            careerId: id,
            userlogin: {
              userloginId: userId,
            },
          },
        },
      });
    } catch (error) {
      throw new HttpException(
        {
          message:
            'Es ist ein Fehler beim Löschen des Karriereeintrags aufgetreten. Bitte versuche es später erneut.',
        },
        500,
      );
    }
  }
}
