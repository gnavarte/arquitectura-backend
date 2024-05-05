import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {

    @IsString()
    @MinLength(3)
    name: string;
    
    @IsEmail()
    email: string;
    
    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter and one number',
    })
    password: string;
    }