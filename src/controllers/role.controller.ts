import { NextFunction, Request, Response } from 'express';
import { CreateRoleDto } from '@/dtos/roles.dto';
import { Role } from '@/interfaces/role.interface';
import RoleService from '@/services/role.service';

class RoleController {
  public roleService = new RoleService();

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const role: CreateRoleDto = req.body;
      const roleData: Role = await this.roleService.createRole(role);

      res.status(201).json({ data: roleData, message: 'role.create' });
    } catch (error) {
      next(error);
    }
  };

  public list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const roles = await this.roleService.findAllRoles();

      res.status(200).json({ data: roles, message: 'role.list' });
    } catch (error) {
      next(error);
    }
  };
}

export default RoleController;
