import bcrypt from 'bcrypt';
import { getRepository } from 'typeorm';
import { CreateUserDto } from '@dtos/users.dto';
import HttpException from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';
import { PermissionEntity } from '@/entity/permissions.entity';
import { CreatePermissionDto } from '@/dtos/permissions.dto';
import { Permission } from '@/interfaces/permission.interface';

class PermissionService {
  public permissions = PermissionEntity;

  public async findAllPermission(): Promise<Permission[]> {
    const permissionRepository = getRepository(this.permissions);
    const permissions: Permission[] = await permissionRepository.find();
    return permissions;
  }

  public async createPermission(permissionData: CreatePermissionDto): Promise<Permission> {
    if (isEmpty(permissionData)) throw new HttpException(400, "You're not permission data");

    const permissionRepository = getRepository(this.permissions);
    const findPermission: Permission = await permissionRepository.findOne({ where: { permission: permissionData.permission } });
    if (findPermission) throw new HttpException(409, `Permission: "${permissionData.permission}" already exists`);

    const createPermissionData: Permission = await permissionRepository.save({ ...permissionData });

    return createPermissionData;
  }
}

export default PermissionService;
