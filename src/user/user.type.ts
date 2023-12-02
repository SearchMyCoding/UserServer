import { User } from "src/schemas/user.schema";

export type Role = "user" | "silver" | "gold" | "vip" | "admin" | "master" | "avoid" | "blacked" | "sleep";
export type Key = keyof User | "all";