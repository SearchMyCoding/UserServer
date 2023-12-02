import * as crypto from 'crypto';
import { hash_algorithm, salt } from 'src/config/crypto.config';

export function createHashPassword(passeord : string, length : number = 32) : string {
    const toHash : string = `${passeord}${salt}`;
    return crypto.createHash(hash_algorithm).update(passeord).digest('hex').slice(0, length);
}

export function compareHash(password : string, hashedPassword : string) : boolean {
    return createHashPassword(password) === hashedPassword;
}