import jwt from "jsonwebtoken"
import crypto from "crypto"
import { env } from "../config/env.js";
import { REFRESH_TTL, ACCESS_TTL, VERIFICATION_TTL } from "../config/constant.js"

export function generateAccessToken(userId, username) {
    const payload = {
        id : userId,
        username : username
    };
    return jwt.sign(payload, env.jwt_secret, { expiresIn: ACCESS_TTL });
}

export function generateRefreshToken() {
    const jti = crypto.randomUUID();
    const raw = crypto.randomBytes(64).toString("hex");
    const refreshToken = `${jti}.${raw}`;
    const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    const expiresAt = new Date(Date.now() + REFRESH_TTL);
    return { refreshToken, tokenHash, expiresAt, jti };
}

export function generateVerificationToken() {
    const id = crypto.randomUUID();
    const raw = crypto.randomBytes(64).toString("hex");
    const token = `${id}.${raw}`;
    const expiresAt = new Date(Date.now() + VERIFICATION_TTL);
    return { token, expiresAt, id };
}

export function generatePasswordResetToken() {
    const { refreshToken, tokenHash, expiresAt, jti } = generateRefreshToken();
    return {
        token: refreshToken,
        tokenHash,
        expiresAt,
        id: jti
    };
}

