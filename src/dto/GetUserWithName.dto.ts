import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetUserWithNameDto{
    @ApiProperty({
        description : "아이디"
    })
    @IsString()
    @IsNotEmpty()
    readonly id : string;

    @ApiProperty({
        description : "이름"
    })
    @IsString()
    @IsNotEmpty()
    readonly name : string;
}