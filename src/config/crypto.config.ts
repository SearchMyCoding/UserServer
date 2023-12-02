import { ConfigService } from "@nestjs/config";
import 'dotenv/config';

const config : ConfigService = new ConfigService();

export const salt : string = config.get<string>('SALT');
export const hash_algorithm : string = config.get<string>('HASH_ALGORITHM');