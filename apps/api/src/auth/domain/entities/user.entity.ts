import { BaseEntity } from '@common/abstracts/base.entity';
import { GenderEnum } from '@common/enums/gender.enum';
import { Roles } from '@common/enums/role-app.enum';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column({ length: 100, nullable: true })
  fullname?: string;

  @Column({ length: 11, unique: true, nullable: true })
  phone?: string;

  @Column({ nullable: true, select: false })
  password?: string;

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.USER,
  })
  role: Roles;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column({
    type: 'enum',
    enum: GenderEnum,
    nullable: true,
  })
  gender: GenderEnum;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  refreshToken: string | null = null;

  clearRefreshToken(): void {
    this.refreshToken = null;
  }
}
