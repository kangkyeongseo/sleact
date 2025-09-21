import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';

class MockUserRepository {
  #data = [{ id: 1, email: 'test@test.com' }];
  findOne({ email }) {
    const data = this.#data.find((value) => value.email === email);
    if (data) {
      return data;
    }
    return null;
  }
}

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: getRepositoryToken(Users), useClass: MockUserRepository }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findByEmail은 이메일을 통해 유저를 찾아야 함', () => {
    expect(service.findByEmail('test@test.com')).resolves.toStrictEqual({ email: 'test@test.com', id: 1 });
  });

  it('findByEmail은 유저를 못 찾으면 null을 반환해야 함', () => {
    expect(service.findByEmail('test@tes.com')).resolves.toBe(null);
  });
});
