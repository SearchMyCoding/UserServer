import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-local';
import { AuthService } from "src/auth/auth.service";
import { User } from "src/schemas/user.schema";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(
        private readonly authService : AuthService
    ){
        super({
            usernameField: 'id'
          });
    }

    async validate(
        id: string, password: string
    ){
        const user : User = await this.authService.validateUser(id, password);
        if (!user || ["blacked", "sleep"].includes(user.role)) {
          throw new UnauthorizedException(`You are an unvalid user`);
        }
        return user;
    }
}