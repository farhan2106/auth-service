import bcrypt from 'bcrypt';
import { getRepository } from 'typeorm';
import { CreateUserDto } from '@dtos/users.dto';
import { UserEntity } from '@entity/users.entity';
import HttpException from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';
import { PermissionEntity } from '@/entity/permissions.entity';
import { RolesEntity } from '@/entity/roles.entity';

class UserService {
  public users = UserEntity;

  public async findAllUser(): Promise<User[]> {
    const userRepository = getRepository(this.users);
    const users: User[] = await userRepository.find();
    return users;
  }

  public async findUserById(userId: number) {
    if (isEmpty(userId)) throw new HttpException(400, "You're not userId");

    const userRepository = getRepository(this.users);
    const findUser = await userRepository.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const userRepository = getRepository(this.users);
    const findUser: User = await userRepository.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `You're email ${userData.email} already exists`);

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createUserData: User = await userRepository.save({ ...userData, password: hashedPassword });

    return createUserData;
  }

  public async updateUser(userId: number, userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const userRepository = getRepository(this.users);
    const findUser: User = await userRepository.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "You're not user");

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    await userRepository.update(userId, { ...userData, password: hashedPassword });

    const updateUser: User = await userRepository.findOne({ where: { id: userId } });
    return updateUser;
  }

  public async deleteUser(userId: number): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, "You're not userId");

    const userRepository = getRepository(this.users);
    const findUser: User = await userRepository.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "You're not user");

    await userRepository.delete({ id: userId });
    return findUser;
  }

  public async findUserPermissions(userId: number) {
    if (isEmpty(userId)) throw new HttpException(400, "You're not userId");
    PermissionEntity
    const permissonRepository = getRepository(PermissionEntity);
    const userPermissions = await permissonRepository.query(`
      SELECT * FROM ${permissonRepository.metadata.tableName} a
      INNER JOIN role_permissions b ON b.permissionEntityId = a.id
      INNER JOIN user_roles c ON c.rolesEntityId = b.rolesEntityId
      WHERE c.userEntityId = ?
    `, [userId]);

    return userPermissions;
  }

  public async updateUserRole(user: UserEntity, roles: RolesEntity[]) {
    const userRepository = getRepository(this.users);
    user.roles = roles;
    return await userRepository.save(user);
  }
}

export default UserService;
