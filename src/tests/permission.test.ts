import request from 'supertest';
import { createConnection, getRepository } from 'typeorm';
import App from '@/app';
import { dbConnection } from '@databases';
import PermissionRoute from '@/routes/permission.route';
import { CreatePermissionDto } from '@/dtos/permissions.dto';

beforeAll(async () => {
  await createConnection(dbConnection);
});

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Permission', () => {
  describe('[GET] /permissions', () => {
    it('response should list permissions', async () => {
      const permissionRoute = new PermissionRoute();
      const permissions = permissionRoute.permissionController.permissionService.permissions;
      const permissionsRepository = getRepository(permissions);

      permissionsRepository.find = jest.fn().mockReturnValue([{
        id: 1,
        permission: 'read-blog'
      }]);

      const app = new App([permissionRoute]);
      return request(app.getServer()).get(`/api/${permissionRoute.path}permissions`)
        .expect(200);
    });
  });

  describe('[POST] /permissions', () => {
    it('response should create permissions', async () => {
      const permissionRoute = new PermissionRoute();
      const permissions = permissionRoute.permissionController.permissionService.permissions;
      const permissionsRepository = getRepository(permissions);

      const permissionData: CreatePermissionDto = {
        permission: 'read-blog'
      };

      permissionsRepository.findOne = jest.fn().mockReturnValue(null);
      permissionsRepository.save = jest.fn().mockReturnValue({
        id: 1,
        permission: 'read-blog'
      });

      const app = new App([permissionRoute]);
      return request(app.getServer()).post(`/api/${permissionRoute.path}permissions`)
        .send(permissionData)
        .expect(201);
    });
  });
});
