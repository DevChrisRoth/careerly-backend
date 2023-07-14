import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { CareerService } from './career.service';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';

@Controller('career')
export class CareerController {
  constructor(private readonly careerService: CareerService) {}

  @UseGuards(AuthenticatedGuard)
  @Post()
  async create(@Body() createCareerDto: CreateCareerDto, @Req() req: any) {
    await this.careerService.create(createCareerDto, req.user.id);
  }

  @Get('profile/:username')
  async findAll(@Param('username') username: string) {
    return await this.careerService.findAll(username);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.careerService.findOne(+id);
  }

  @UseGuards(AuthenticatedGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCareerDto: UpdateCareerDto,
    @Req() req: any,
  ) {
    return this.careerService.update(+id, updateCareerDto, req.user.id);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.careerService.remove(+id, req.user.id);
  }
}
