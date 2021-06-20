import { Router } from 'express';
import Route from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import RoleController from '@/controllers/role.controller';
import { CreateRoleDto } from '@/dtos/roles.dto';

class RoleRoute implements Route {
  public path = '/';
  public router = Router();
  public roleController = new RoleController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}roles`, validationMiddleware(CreateRoleDto, 'body'), this.roleController.create);
    this.router.get(`${this.path}roles`, this.roleController.list);
  }
}

export default RoleRoute;
