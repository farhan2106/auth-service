import { NextFunction, Request, Response } from 'express';
import { CreateUserDto, SetUserRolesDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import UserService from '@services/users.service';
import RoleService from '@/services/role.service';

class UsersController {
  public userService = new UserService();
  public roleService = new RoleService();

  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllUsersData: User[] = await this.userService.findAllUser();

      res.status(200).json({ data: findAllUsersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const findOneUserData: User = await this.userService.findUserById(userId);

      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const createUserData: User = await this.userService.createUser(userData);

      res.status(201).json({ data: createUserData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const userData: CreateUserDto = req.body;
      const updateUserData: User = await this.userService.updateUser(userId, userData);

      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const deleteUserData: User = await this.userService.deleteUser(userId);

      res.status(200).json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public getUserRoles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const findOneUserData = await this.userService.findUserById(userId);

      res.status(200).json({ data: findOneUserData.roles, message: 'user.getUserRoles' });
    } catch (error) {
      next(error);
    }
  };

  public addUserRoles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const rolesData: SetUserRolesDto = req.body;
      const findOneUserData = await this.userService.findUserById(userId);
      const findRoleData = await this.roleService.findRolesByName(rolesData.roles);
      const missingRoles = rolesData.roles.filter(val => !findRoleData.map(entity => entity.role).includes(val));

      if (missingRoles.length > 0) {
        res.status(500).json({ message: `Roles: ${missingRoles.join(',')} does not exist. Please create it first.` });
      } else {
        await this.userService.updateUserRole(findOneUserData, findRoleData);
        res.status(200).json({ data: findOneUserData.roles, message: 'user.addUserRoles' });
      }
    } catch (error) {
      next(error);
    }
  };

  public getUserPermissions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const userPermissions = await this.userService.findUserPermissions(userId);

      res.status(200).json({ data: userPermissions, message: 'user.permissions' });
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
