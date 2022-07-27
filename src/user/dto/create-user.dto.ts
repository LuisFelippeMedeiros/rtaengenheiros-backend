import { User } from '../entities/user.entity';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto extends User {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;

  @IsString()
  group_id: string;
}
