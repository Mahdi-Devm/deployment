import { UserRepository } from '@auth/domain/repositories/user.repository';
import { Roles } from '@common/enums/role-app.enum';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/domain/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TypeOrmUserRepository extends UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {
    super();
  }

  async findByEmail(email: string) {
    return this.repository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        refreshToken: true,
      },
    });
  }

  async save(user: User) {
    await this.repository.save(user);
  }

  async findById(id: string) {
    return this.repository.findOne({
      where: { id },
    });
  }

  async create(data: {
    email: string;
    password: string;
    role: Roles;
  }): Promise<User> {
    return await this.repository.create(data);
  }
}
