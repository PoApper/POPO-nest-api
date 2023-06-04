import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  CacheInterceptor,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PopoSettingDto } from './setting.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/authroization/roles.decorator';
import { UserType } from '../user/user.meta';
import { RolesGuard } from 'src/auth/authroization/roles.guard';
import { FileService } from '../../file/file.service';

@ApiTags('POPO 세팅')
@Controller('setting')
@UseInterceptors(CacheInterceptor)
export class SettingController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @Roles(UserType.admin, UserType.association)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updatePopoSetting(@Body() dto: PopoSettingDto) {
    const settingKey = 'popo-setting.json';
    return this.fileService.uploadText(settingKey, JSON.stringify(dto));
  }
}
