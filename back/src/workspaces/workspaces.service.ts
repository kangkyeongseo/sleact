import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelMembers } from 'src/entities/ChannelMembers';
import { Channels } from 'src/entities/Channels';
import { Users } from 'src/entities/Users';
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers';
import { Workspaces } from 'src/entities/Workspaces';
import { Repository } from 'typeorm';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspaces)
    private workspacesRepository: Repository<Workspaces>,
    @InjectRepository(Channels)
    private channelsRepository: Repository<Channels>,
    @InjectRepository(WorkspaceMembers)
    private workspaceMemberRepository: Repository<WorkspaceMembers>,
    @InjectRepository(ChannelMembers)
    private ChannelMembersRepository: Repository<ChannelMembers>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async findById(id: number) {
    return this.workspacesRepository.findOne({ where: { id } });
  }

  async findMyWorkspaces(myId: number) {
    return this.workspacesRepository.find({ where: { WorkspaceMembers: { UserId: myId } } });
  }

  async createWorkspace(name: string, url: string, myId: number) {
    const workspace = this.workspacesRepository.create({ name, url, OwnerId: myId });
    const returned = await this.workspacesRepository.save(workspace);

    const workspaceMember = new WorkspaceMembers();
    workspaceMember.UserId = myId;
    workspaceMember.WorkspaceId = returned.id;

    const channel = new Channels();
    channel.name = '일반';
    channel.WorkspaceId = returned.id;

    const [, channelReturned] = await Promise.all([
      this.workspaceMemberRepository.save(workspaceMember),
      this.channelsRepository.save(channel),
    ]);

    const channelMember = new ChannelMembers();
    channelMember.UserId = myId;
    channelMember.ChannelId = channelReturned.id;
    await this.ChannelMembersRepository.save(channelMember);
  }

  async getWorkspaceMembers(url: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.WorkspaceMembers', 'member')
      .innerJoin('member.Workspace', 'workspace', 'workspace.url = :url', { url: url })
      .getMany();
  }

  async createWorkspaceMembers(url, email) {
    const workspace = await this.workspacesRepository.findOne({ where: { url }, relations: ['Channels'] });

    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user || !workspace) {
      return null;
    }

    const workspaceMember = new WorkspaceMembers();
    workspaceMember.WorkspaceId = workspace.id;
    workspaceMember.UserId = user.id;
    await this.workspaceMemberRepository.save(workspaceMember);
    const channelMember = new ChannelMembers();
    channelMember.ChannelId = workspace.Channels.find((channel) => channel.name === '일반')!.id;
    channelMember.UserId = user.id;
    await this.ChannelMembersRepository.save(channelMember);
  }

  async getWorkspaceMember(url, id) {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.id === id', { id })
      .innerJoinAndSelect('user.workspaces', 'workspaces', 'workspaces.url === url', { url })
      .getOne();
  }
}
