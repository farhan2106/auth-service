import { Router } from 'express';
import Route from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import PermissionController from '@/controllers/permission.controller';
import { CreatePermissionDto } from '@/dtos/permissions.dto';

class PermissionRoute implements Route {
  public path = '/';
  public router = Router();
  public permissionController = new PermissionController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}permissions`, validationMiddleware(CreatePermissionDto, 'body'), this.permissionController.create);
    this.router.get(`${this.path}permissions`, this.permissionController.list);
  }
}

export default PermissionRoute;
