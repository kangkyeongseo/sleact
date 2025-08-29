import { Controller, Get, Param, Post, Query } from '@nestjs/common';

@Controller('api/workspaces/:url/dms')
export class DmsController {
  @Get(':id/chats')
  getchat(@Query() query, @Param() param) {}

  @Post(':id/chats')
  postChat() {}
}
