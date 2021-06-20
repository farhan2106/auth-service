import request from 'supertest';
import { createConnection, getRepository } from 'typeorm';
import App from '@/app';
import { dbConnection } from '@databases';
import RoleRoute from '@/routes/role.route';
import { CreateRoleDto } from '@/dtos/roles.dto';

beforeAll(async () => {
  await createConnection(dbConnection);
});

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Role', () => {
  describe('[GET] /roles', () => {
    it('response should list roles', async () => {
      const roleRoute = new RoleRoute();
      const roles = roleRoute.roleController.roleService.roles;
      const rolesRepository = getRepository(roles);

      rolesRepository.find = jest.fn().mockReturnValue([
        {
          "id": 1,
          "role": "admin7",
          "createdAt": "2021-06-19T02:24:53.482Z",
          "updatedAt": "2021-06-19T02:24:53.482Z",
          "permissions": [
            {
              "id": 1,
              "permission": "read-blog",
              "createdAt": "2021-06-19T01:35:24.618Z",
              "updatedAt": "2021-06-19T01:35:24.618Z"
            }
          ]
        }
      ]);

      const app = new App([roleRoute]);
      return request(app.getServer()).get(`/api/${roleRoute.path}roles`)
        .expect(200);
    });
  });

  describe('[POST] /roles', () => {
    it('response should create roles', async () => {
      const roleRoute = new RoleRoute();
      const roles = roleRoute.roleController.roleService.roles;
      const rolesRepository = getRepository(roles);

      const roleData: CreateRoleDto = {
        "role": "admin",
        "permissions": ["read-blog"]
      }

      rolesRepository.findOne = jest.fn().mockReturnValue(null);
      rolesRepository.save = jest.fn().mockReturnValue({
        "id": 1,
        "role": "admin1",
        "createdAt": "2021-06-19T00:54:02.225Z",
        "updatedAt": "2021-06-19T00:54:02.225Z",
        "permissions": [
          {
            "id": 1,
            "permission": "read-blog",
            "createdAt": "2021-06-18T18:30:58.396Z",
            "updatedAt": "2021-06-18T18:30:58.396Z"
          }
        ]
      });

      const app = new App([roleRoute]);
      return request(app.getServer()).post(`/api/${roleRoute.path}roles`)
        .send(roleData)
        .expect(201);
    });
  });
});
