import { UserPost } from '../entities/user.entity';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto extends UserPost {
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
}
