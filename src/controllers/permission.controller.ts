import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { CreatePermissionDto } from '@/dtos/permissions.dto';
import { Permission } from '@/interfaces/permission.interface';
import PermissionService from '@/services/permission.service';

class PermissionController {
  public permissionService = new PermissionService();

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const permission: CreatePermissionDto = req.body;
      const permissionData: Permission = await this.permissionService.createPermission(permission);

      res.status(201).json({ data: permissionData, message: 'permission.create' });
    } catch (error) {
      next(error);
    }
  };

  public list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const permissions = await this.permissionService.findAllPermission();

      res.status(200).json({ data: permissions, message: 'permission.list' });
    } catch (error) {
      next(error);
    }
  };
}

export default PermissionController;
