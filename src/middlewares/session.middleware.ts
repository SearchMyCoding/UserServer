import { INestApplication } from "@nestjs/common";
import session from "express-session";
import { sessionOption } from "src/config/session.config";
import passport from 'passport';

export function SessionMiddleware(app: INestApplication){
    app.use(session(sessionOption));
    app.use(passport.initialize());
    app.use(passport.session());
}