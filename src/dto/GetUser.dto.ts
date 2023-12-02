import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetUserDto{
    @ApiProperty({
        description : "아이디"
    })
    @IsString()
    @IsNotEmpty()
    readonly id : string;

    @ApiProperty({
        description : "비밀번호"
    })
    @IsString()
    @IsNotEmpty()
    readonly password : string;
}