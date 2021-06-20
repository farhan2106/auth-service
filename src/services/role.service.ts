import { getConnection, getRepository } from 'typeorm';
import HttpException from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { PermissionEntity } from '@/entity/permissions.entity';
import { CreateRoleDto } from '@/dtos/roles.dto';
import { RolesEntity } from '@/entity/roles.entity';
import { Role } from '@/interfaces/role.interface';

class RoleService {
  public roles = RolesEntity;

  public async findAllRoles(): Promise<Role[]> {
    const roleRepository = getRepository(this.roles);
    const roles = await roleRepository.find();
    return roles;
  }

  public async createRole(roleData: CreateRoleDto): Promise<Role> {
    if (isEmpty(CreateRoleDto)) throw new HttpException(400, "You're not role data");

    const roleRepository = getRepository(this.roles);
    const findRole = await roleRepository.findOne({ where: { role: roleData.role } });

    // create permission if not exist
    let permissions = [];
    if (roleData.permissions.length > 0) {
      const permissionRepository = getRepository(PermissionEntity);
      const promises = roleData.permissions.map(p => {
        return permissionRepository.query(
          `INSERT IGNORE INTO ${permissionRepository.metadata.tableName} SET permission = ?`, [p]);
      })
      await Promise.all(promises);
      
      // get permissions by string
      permissions = await getConnection().createQueryBuilder(PermissionEntity, 'permission')
        .where("permission.permission IN (:permission)", { permission: roleData.permissions })
        .getMany();
    }

    // create or update new role
    let createRoleData;
    if (findRole) {
      findRole.permissions = permissions;
      createRoleData = await roleRepository.save(findRole);
    } else {
      createRoleData = await roleRepository.save({ role: roleData.role, permissions });
    }

    return createRoleData;
  }

  public async findRolesByName(name: string[]) {
    const roles = await getConnection().createQueryBuilder(this.roles, 'role')
      .where("role.role IN (:role)", { role: name })
      .getMany();
    return roles;
  }
}

export default RoleService;
