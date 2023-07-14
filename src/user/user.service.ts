import { HttpException, Injectable } from '@nestjs/common';
import { genSaltSync, hash } from 'bcryptjs';
import { PrismaService } from 'src/prisma_config/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const salt = genSaltSync(10);
      const Userlogin = await this.prisma.userlogin.create({
        data: {
          email: createUserDto.email,
          password: await hash(createUserDto.password, salt),
        },
      });
      const Userconfig = await this.prisma.userconfig.create({
        data: {
          name:
            '@' +
            createUserDto.firstname.trim() +
            '' +
            createUserDto.lastname.trim(),
          firstname: createUserDto.firstname,
          lastname: createUserDto.lastname,
          profileImageUrl: createUserDto.profileImageUrl,
          title: createUserDto.title,
          bioDescription: createUserDto.bioDescription,
          userlogin: {
            connect: {
              userloginId: Userlogin.userloginId,
            },
          },
        },
      });
      return {
        Userlogin,
        Userconfig,
      };
    } catch (error) {
      throw new HttpException(
        {
          message:
            'Es ist ein Fehler bei der Accounterstellung aufgetreten. Bitte versuche es später erneut.',
        },
        500,
      );
    }
  }

  async updateProfile(id: number, updateUserDto: UpdateUserDto) {
    try {
      await this.prisma.userconfig.update({
        where: {
          userconfigId: id,
        },
        data: {
          name:
            '@' +
            updateUserDto.firstname.trim() +
            '' +
            updateUserDto.lastname.trim(),
          firstname: updateUserDto.firstname,
          lastname: updateUserDto.lastname,
          profileImageUrl: updateUserDto.profileImageUrl,
          title: updateUserDto.title,
          bioDescription: updateUserDto.bioDescription,
        },
      });
    } catch (error) {
      throw new HttpException(
        {
          message:
            'Es ist ein Fehler bei der Accounterstellung aufgetreten. Bitte versuche es später erneut.',
        },
        500,
      );
    }
  }

  async deleteProfile(id: number) {
    try {
      await this.prisma.userconfig.delete({
        where: {
          userconfigId: id,
        },
      });
    } catch (error) {
      throw new HttpException(
        {
          message:
            'Es ist ein Fehler bei der Accounterstellung aufgetreten. Bitte versuche es später erneut.',
        },
        500,
      );
    }
  }
}
