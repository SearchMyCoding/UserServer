import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/user/user.type';

export class UpdateUserDto{
    @ApiProperty({
        description : "비밀번호"
    })
    @IsString()
    @IsNotEmpty()
    readonly password : string;

    @ApiProperty({
        description : "바꿀 비밀번호"
    })
    @IsString()
    @IsOptional()
    readonly modifyPassword? : string;

    @ApiProperty({
        description : "바꿀 이메일"
    })
    @IsString()
    @IsOptional()
    readonly modifyEmail? : string;

    @ApiProperty({
        description : "바꿀 이름"
    })
    @IsString()
    @IsOptional()
    readonly modifyName? : string;

    @ApiProperty({
        description : "바꿀 역할"
    })
    @IsString()
    @IsOptional()
    readonly modifyRole? : Role;
}