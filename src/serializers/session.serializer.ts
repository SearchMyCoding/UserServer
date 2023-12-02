import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from 'src/schemas/user.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(
        private readonly userService: UserService,
    ){
        super();
    }
    serializeUser(user: User, done: (err: Error | null, id?: string) => void): void {
        done(null, user.id);
    }

    async deserializeUser(userId: string, done: (err: Error | null, user?: User) => void) {
        try{
            const user = await this.userService.getUser(userId);
            this.userService.updateLastLogIn(user.id);
            done(null, user);
        }catch(error){
            done(error);
        }
        
    }
}