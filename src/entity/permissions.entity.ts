import { IsNotEmpty } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
import { Permission } from '@/interfaces/permission.interface';

@Entity()
@Unique('unique_permission', ['permission'])
export class PermissionEntity implements Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  permission: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
