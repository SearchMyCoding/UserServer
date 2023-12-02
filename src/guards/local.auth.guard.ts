import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";

@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const result = await super.canActivate(context);
        if(!result)
          return false;

        const request : Request = context.switchToHttp().getRequest();
        await super.logIn(request);
        return true;
    }
}