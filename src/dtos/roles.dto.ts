import { IsArray, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  public role: string;

  @IsArray({})
  public permissions: string[]
}
