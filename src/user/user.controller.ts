import { Body, Controller, Get, Patch, Post, Query, Req, Res, Session, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from 'src/dto/CreateUser.dto';
import { GetUserWithNameDto } from 'src/dto/GetUserWithName.dto';
import { UpdateUserDto } from 'src/dto/UpdateUser.dto';
import { User } from 'src/schemas/user.schema';
import { UserService } from './user.service';
import { LocalAuthGuard } from 'src/guards/local.auth.guard';
import { GetUserDto } from 'src/dto/GetUser.dto';
import { DUser } from 'src/decorators/user.decorator';
import { LoggedInGuard } from 'src/guards/logged-in.guard';
import { promisify } from 'util';
import { Request } from 'express';

@Controller('/user')
export class UserController {
    constructor(
        private readonly userService : UserService
    ){}

    @Get('/id')
    @ApiOperation({
        "summary" : "아이디 찾기",
        "description" : "이름과 email을 이용하여 유저 아이디를 가져온다."
    })
    async getUserId(@Query("name") name : string, @Query("email") email : string) : Promise<string>{
        return await this.userService.getUserId(name, email);
    }

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    @ApiBody({
        type: GetUserDto,
    })
    @ApiOperation({
        "summary" : "유저 정보 가져오기",
        "description" : "id과 password를 이용하여 유저 정보를 가져온다."
    })
    async logIn(@DUser() user : User,@Session() session: Record<string, any>){
        this.userService.updateLastLogIn(user.id);
        return {user, SID : session.id};
    };

    @UseGuards(LoggedInGuard)
    @Post('/info')
    @ApiOperation({
        "summary" : "유저 정보 가져오기",
        "description" : "id과 password를 이용하여 유저 정보를 가져온다."
    })
    async getUser(@DUser() user : User,@Session() session: Record<string, any>){
        return {user, SID : session.id};
    };

    @Post("/signUp")
    @ApiOperation({
        "summary" : "회원가입",
        "description" : "CreateUserDto를 이용하여 회원가입을 진행한다."
    })
    async SignUp(@Body() createUserDto: CreateUserDto) : Promise<void>{
        return await this.userService.addUser(createUserDto);
    };

    @UseGuards(LoggedInGuard)
    @Patch("/password")
    @ApiOperation({
        "summary" : "유저의 비밀번호 변경",
        "description" : "UpdateUserDto를 이용하여 유저의 비밀번호를 변경한다."
    })
    async updatePassword(@DUser() user : User, @Body() updateUserDto: UpdateUserDto) : Promise<void>{
        return await this.userService.updateUser(user, updateUserDto, "password");
    }

    @Patch("/password/default")
    @ApiOperation({
        "summary" : "유저의 비밀번호 초기화",
        "description" : "GetUserWithoutPasswordDto를 이용하여 유저의 비밀번호를 초기화한다."
    })
    async changeDefaultPassword(@Body() getUserWithNameDto : GetUserWithNameDto) : Promise<string>{
        const {id, name} = getUserWithNameDto;
        const userId : string = await this.userService.getUserId(id, name);
        const user : User = await this.userService.getUser(userId);
        return await this.userService.changeDefaultPassword(user);
    }

    @UseGuards(LoggedInGuard)
    @Get('logout')
    async logOut(@Req() req : Request, @DUser() user : User){
        await promisify(req.session.destroy.bind(req.session))();
        return {
            msg : `Bye ${user.id}`
        }
    }
}
