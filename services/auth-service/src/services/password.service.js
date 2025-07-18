import bcrypt from "bcrypt"
import { BCRYPT_SALT_ROUNDS } from "../config/constant.js"

export async function hashPassword(password) {
    const hashed_password = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    return hashed_password;
}