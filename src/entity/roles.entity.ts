import { IsNotEmpty } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Role } from '@/interfaces/role.interface';
import { PermissionEntity } from './permissions.entity';

@Entity()
@Unique(['role'])
export class RolesEntity implements Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  role: string;

  @ManyToMany(() => PermissionEntity, { eager: true })
  @JoinTable({ name: 'role_permissions' })
  permissions: PermissionEntity[];

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
