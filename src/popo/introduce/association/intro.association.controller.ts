import {
  BadRequestException,
  Body,
  CacheInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { IntroAssociationService } from './intro.association.service';
import { CreateIntroAssociationDto } from './intro.association.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/authroization/roles.guard';
import { Roles } from '../../../auth/authroization/roles.decorator';
import { UserType } from '../../user/user.meta';
import { FileBody } from '../../../file/file-body.decorator';
import { ClubImageDto } from '../club/intro.club.dto';
import { FileService } from '../../../file/file.service';

@ApiTags('Introduce Association')
@Controller('introduce/association')
@UseInterceptors(CacheInterceptor)
export class IntroAssociationController {
  constructor(
    private readonly introAssociationService: IntroAssociationService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.admin, UserType.association)
  create(@Body() createIntroAssociationDto: CreateIntroAssociationDto) {
    return this.introAssociationService.save(createIntroAssociationDto);
  }

  @Post('image/:uuid')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.admin, UserType.association)
  @FileBody('image')
  async uploadImage(@Param('uuid') uuid: string, @Body() dto: ClubImageDto) {
    const image_url = await this.fileService.uploadFile(
      `club/${uuid}`,
      dto.image,
    );
    await this.introAssociationService.updateImageUrl(uuid, image_url);
    return image_url;
  }

  @Get()
  get() {
    return this.introAssociationService.find({ order: { name: 'ASC' } });
  }

  @Get('name/:name')
  async getOneByName(@Param('name') name: string) {
    const introAssociation = await this.introAssociationService.findOne({
      name: name,
    });

    if (introAssociation) {
      await this.introAssociationService.updateViewCount(
        introAssociation.uuid,
        introAssociation.views + 1,
      );
      return introAssociation;
    } else {
      throw new BadRequestException('Not Exist');
    }
  }

  @Put(':uuid')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.admin, UserType.association)
  put(
    @Param('uuid') uuid: string,
    @Body() updateIntroAssociationDto: CreateIntroAssociationDto,
  ) {
    return this.introAssociationService.update(uuid, updateIntroAssociationDto);
  }

  @Delete(':uuid')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.admin, UserType.association)
  delete(@Param('uuid') uuid: string) {
    return this.introAssociationService.remove(uuid);
  }
}
