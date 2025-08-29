import { Controller, Get, Param, Post, Query } from '@nestjs/common';

@Controller('api/workapces/:url/channels')
export class ChannelsController {
  @Get()
  getAllchannels() {}

  @Post()
  createChannel() {}

  @Get('name')
  getSpecificChannel() {}

  @Get(':name/chats')
  getchats(@Query() query, @Param() param) {}

  @Post(':name/chats')
  postChat() {}

  @Get(':name/members')
  getAllMembers() {}

  @Post(':name/members')
  inviteMember() {}
}
