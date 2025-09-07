import { Body, Controller, Get, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import { JoinRequestDto } from './dto/join.request.dto';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from 'src/common/dto/user.dto';
import { User } from 'src/common/decorator/user.decorator';
import { UndefinedToNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptor';

@UseInterceptors(UndefinedToNullInterceptor)
@ApiTags('USER')
@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiResponse({ status: 200, description: '성공', type: UserDto })
  @ApiOperation({ summary: '내 정보 조회' })
  @Get()
  getUsers(@User() user) {
    return user;
  }

  @ApiOperation({ summary: '회원가입' })
  @Post()
  async Join(@Body() data: JoinRequestDto) {
    await this.usersService.join(data.email, data.nickname, data.password);
  }

  @ApiResponse({ status: 200, description: '성공', type: UserDto })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiOperation({ summary: '로그인' })
  @Post('login')
  logIn(@User() user) {
    return user;
  }

  @ApiOperation({ summary: '로그아웃' })
  @Post('logout')
  logOut(@Req() req, @Res() res) {
    req.logOut();
    res.clearCookie('connect.sid', { httpOnly: true });
    res.send('ok');
  }
}
