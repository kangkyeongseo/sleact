import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  async join(email: string, nickname: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      throw new UnauthorizedException('이미 존재하는 사용자입니다.');
    }

    const hashsedPassword = await bcrypt.hash(password, 12);
    await this.userRepository.save({ email, nickname, password: hashsedPassword });
  }
}
