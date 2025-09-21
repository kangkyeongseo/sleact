import { Controller, Get, Param, Post, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChannelsService } from './channels.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { User } from 'src/common/decorator/user.decorator';

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

@ApiTags('CHANNEL')
@Controller('api/workapces/:url/channels')
export class ChannelsController {
  constructor(private channelsService: ChannelsService) {}

  @Get()
  getAllchannels() {}

  @Post()
  createChannel() {}

  @Get('name')
  getSpecificChannel() {}

  @Get(':name/chats')
  getchats(@Query() query, @Param() param) {
    // return this.channelsService.getWorkspaceChannelChats(query.url);
  }

  @Post(':name/chats')
  postChat() {}

  @Get(':name/members')
  getAllMembers(@Param('url') url: string, @Param('name') name: string) {
    return this.channelsService.getWorkspaceChannelMembers(url, name);
  }

  @Post(':name/members')
  inviteMember() {}

  @UseInterceptors(
    FilesInterceptor('image', 10, {
      storage: multer.diskStorage({
        destination(req, file, cb) {
          cb(null, 'uploads/');
        },
        filename(req, file, cb) {
          const ext = path.extname(file.originalname);
          cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  @Post(':name/images')
  postImage(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('url') url: string,
    @Param('name') name: string,
    @User() user,
  ) {
    this.channelsService.createWorkspaceChannelImages(url, name, files, user);
  }
}
