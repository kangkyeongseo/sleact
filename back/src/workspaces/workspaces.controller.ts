import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WorkspacesService } from './workspaces.service';
import { User } from 'src/common/decorator/user.decorator';
import { Users } from 'src/entities/Users';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';

@ApiTags('WORKSPACE')
@Controller('api/workspaces')
export class WorkspacesController {
  constructor(private workspacesService: WorkspacesService) {}

  @Get()
  getMyWorkspaces(@User() user: Users) {
    this.workspacesService.findMyWorkspaces(user.id);
  }

  @Post()
  createWorkspace(@User() user: Users, @Body() body: CreateWorkspaceDto) {
    this.workspacesService.createWorkspace(body.workspace, body.url, user.id);
  }

  @Get(':url/members')
  getAllMembersFromWorksapce() {}

  @Post(':url/members')
  inviteMemberToWorkspace() {}

  @Delete(':url/members/:id')
  kickMemberFromWorkspace() {}

  @Get(':url/members/:id')
  getMemberInfoInWorksapce() {}
}
