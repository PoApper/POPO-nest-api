import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { PopoSettingDto, RcStudentsListDto } from './setting.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/authroization/roles.decorator';
import { UserType } from '../user/user.meta';
import { RolesGuard } from 'src/auth/authroization/roles.guard';
import { FileService } from '../../file/file.service';
import { FileBody } from '../../file/file-body.decorator';

@ApiTags('POPO 세팅')
@Controller('setting')
export class SettingController {
  constructor(private readonly fileService: FileService) {}

  @Get()
  async getSetting() {
    return this.fileService.getText('popo-setting.json');
  }

  @Post()
  @Roles(UserType.admin, UserType.association)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updatePopoSetting(@Body() dto: PopoSettingDto) {
    const settingKey = 'popo-setting.json';
    return this.fileService.uploadText(settingKey, JSON.stringify(dto));
  }

  @Post('rc-students-list')
  @Roles(UserType.admin, UserType.association)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @FileBody('csv_file')
  async uploadRcStudentList(@Body() dto: RcStudentsListDto) {
    const csv_url = await this.fileService.uploadFile(
      'popo-rc-students-list.csv',
      dto.csv_file,
    );
    return csv_url;
  }

  @Get('rc-students-list')
  @Roles(UserType.admin, UserType.association)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getRcStudentList(@Res() res: Response) {
    const data = await this.fileService.getFile('popo-rc-students-list.csv');
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="rc-students-list.csv"`);
    res.send(data);
  }
}
