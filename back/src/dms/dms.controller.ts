import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('DM')
@Controller('api/workspaces/:url/dms')
export class DmsController {
  @ApiParam({ name: 'url', description: '워크스페이스 url', required: true })
  @ApiParam({ name: 'id', description: '시용자 id', required: true })
  @ApiQuery({ name: 'perPage', description: '한 번에 가져오는 개수', required: true })
  @ApiQuery({ name: 'page', description: '불러올 페이지', required: true })
  @Get(':id/chats')
  getchat(@Query() query, @Param() param) {}

  @Post(':id/chats')
  postChat() {}
}
