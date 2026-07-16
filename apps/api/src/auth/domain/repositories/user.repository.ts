import { Roles } from '@common/enums/role-app.enum';
import { User } from '../entities/user.entity';

export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<User | null>;

  abstract findById(id: string): Promise<User | null>;

  abstract save(user: User): Promise<void>;

  abstract create(data: {
    email: string;
    password: string;
    role: Roles;
  }): Promise<User>;
}
