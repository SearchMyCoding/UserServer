import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { User } from 'src/schemas/user.schema';
import { compareHash } from 'src/utils/hash';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {}
    async validateUser(id: string, password: string) : Promise<User> {
        try{
            const user : User = await this.userService.getUser(id);
            if(!compareHash(password, user.password)){
                throw new UnauthorizedException(`Password is wrong`);
            }
            return user;
        }catch(err){
            throw err;
        }
    }
}
