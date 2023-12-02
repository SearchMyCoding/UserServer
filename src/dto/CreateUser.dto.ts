import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserDto{
    @ApiProperty({
        description : "이름"
    })
    @IsString()
    readonly name : string;

    @ApiProperty({
        description : "아이디"
    })
    @IsString()
    readonly id : string;

    @ApiProperty({
        description : "전자 메일"
    })
    @IsString()
    readonly email : string;

    @ApiProperty({
        description : "비밀번호"
    })
    @IsString()
    readonly password : string;
}