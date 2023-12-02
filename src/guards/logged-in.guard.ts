// auth/logged-in.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class LoggedInGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request : Request = context.switchToHttp().getRequest();
    const result : boolean = request.isAuthenticated();
    if(result){
      const minute : number = 60 * 1000;
      const updateExpires : Date = new Date((new Date().getTime()) + minute);
      request.session.cookie.expires = updateExpires;
      request.sessionStore.set(request.sessionID, request.session);
    }
    return result;
  }
}