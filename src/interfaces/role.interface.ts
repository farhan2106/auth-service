import { Permission } from "./permission.interface";

export interface Role {
  id: number;
  role: string;
  permissions: Permission[]
}
