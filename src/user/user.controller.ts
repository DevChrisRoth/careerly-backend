import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create') //✅
  async create(@Body() createUserDto: CreateUserDto) {
    await this.userService.create(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login') //✅
  async login(@Req() req: any) {
    return await req.user;
  }

  @UseGuards(AuthenticatedGuard)
  @Post('logout') //✅
  async logout(@Req() req: any): Promise<any> {
    try {
      req.logout();
      return { status: 'Du wurdest erfolgreich ausgeloggt' };
    } catch (error) {
      return { status: 'Ein Fehler ist während des Prozesses aufgetreten' };
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Post('profile/update') //✅
  async updateProfile(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    await this.userService.updateProfile(req.user.id, updateUserDto);
  }

  @UseGuards(AuthenticatedGuard)
  @Post('profile/delete') //✅
  async deleteProfile(@Req() req: any) {
    await this.userService.deleteProfile(req.user.id);
  }
}
