import { IsString } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  public permission: string;
}
