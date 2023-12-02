import { ExecutionContext, Injectable } from "@nestjs/common";
import { LoggedInGuard } from "./logged-in.guard";
import { Request } from "express";

@Injectable()
export class AdminGuard extends LoggedInGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request : Request = context.switchToHttp().getRequest();
    return super.canActivate(context) && ["admin", "master"].includes(request.user["role"]);
  }
}