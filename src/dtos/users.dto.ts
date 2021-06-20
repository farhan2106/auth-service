import { IsArray, IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public username: string;

  @IsString()
  public password: string;
}

export class LoginDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}

export class SetUserRolesDto {
  @IsArray()
  public roles: string[];
}