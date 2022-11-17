import { UserPost } from '../entities/user.entity';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class PostUserDto extends UserPost {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Senha muito fraca',
  })
  password: string;

  @IsString()
  group_id: string;

  @IsString()
  company_id?: string;

  @IsString()
  avatar?: string;
}
