import { assert, BadRequestError, ConflictError, UnauthorizedError } from "../../shared/utils/httpErrors.js"
import { hashPassword } from "./password.service.js"
import { env } from "../config/env.js"
import bcrypt from "bcrypt"
import crypto from "crypto"
import * as UserModel from "../models/users.model.js"
import * as TokenModel from "../models/token.model.js"
import * as TokenService from "./token.service.js"
import * as EmailModel from "../models/email.model.js"
import * as passwordModel from "../models/password.model.js"
import { sendVerificationEmail, sendTestMails } from "./email.service.js"
import pool from "../db/pool.js"


export async function signup({ email, username, password }) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const user_id = await UserModel.findByEmail(email, client);
        assert(!user_id, ConflictError, "Email already registered!");

        const passwordHash = await hashPassword(password);
        const userId = await UserModel.insertUser({ username, email, passwordHash }, client);
        assert(userId, BadRequestError, "user Insertion error!");

        const accesToken = TokenService.generateAccessToken(userId, username);
        const { refreshToken, tokenHash, expiresAt, jti } = TokenService.generateRefreshToken();
        const { token, expiresAt: expires, id } = TokenService.generateVerificationToken();
        const hashedToken = await hashPassword(token);

        const link = `${env.base_url}/api/auth/verify-email/${token}`
        const text = "Verify your Email";
        await sendTestMails(email, link, text);

        await EmailModel.storeVerificationToken({ uuid: id, user_id: userId, hashedToken, expires_at: expires }, client);
        await TokenModel.storeRefreshToken({ userId, tokenHash, expiresAt, jti }, client);
        await client.query("COMMIT");

        return { accesToken, refreshToken, user : {userId, username}};
    } catch (err) {
        if (client) await client.query('ROLLBACK');
        console.log(err);
        throw err;
    } finally {
        client.release();
    }
}

export async function signin({ username, password }) {
    try {
        const client = await pool.connect();
        const user_id = await UserModel.findByUsername(username);
        if (!user_id) {
            throw new UnauthorizedError("Username is not valid!");
        }

        const isMatch = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!isMatch) {
            throw new UnauthorizedError("Passwor is incorrect!");
        }

        const accessToken = TokenService.generateAccessToken(user.rows[0].id);
        const { refreshToken, tokenHash, expiresAt, jti } = TokenService.generateRefreshToken();
        await TokenModel.storeRefreshToken({ userId: user.rows[0].id, tokenHash, expiresAt, jti }, client);

        return { accessToken, refreshToken, user : {userId : user_id, username: username}};
    } catch (err) {
        console.error("Unable to sign in!", err);
        throw err;
    }
}

export async function refresh(jti) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const user_id = await TokenModel.validateRefreshToken({ jti }, client);
        assert(user_id, UnauthorizedError, "Refresh Token is not valid");
        await TokenModel.MarkAsRevoked({ jti }, client);

        const accessToken = TokenService.generateAccessToken(user_id);
        const { refreshToken, tokenHash, expiresAt, jti: new_jti } = TokenService.generateRefreshToken();
        await TokenModel.storeRefreshToken({ userId: user_id, tokenHash, expiresAt, jti: new_jti }, client);

        await client.query("COMMIT");
        return { accessToken, refreshToken };
    } catch (err) {
        if (client) await client.query('ROLLBACK');
        console.error("Unable to refresh access Token", err);
        throw err;
    } finally {
        if (client) client.release();
    }
}

export async function logout(jti) {
    let client;
    try {
        client = await pool.connect();
        await TokenModel.MarkAsRevoked({ jti }, client);
        return true;
    } catch (err) {
        console.error("Cannot log out!", err);
        throw err;
    } finally {
        client.release();
    }
}

export async function verifyEmail(id, plainToken) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const rows = await EmailModel.validateToken(id, client);
        assert(rows, UnauthorizedError, "The token is not valid");

        const isMatch = await bcrypt.compare(plainToken, rows.token_hash);
        assert(isMatch, UnauthorizedError, "The Token is invalid");

        await EmailModel.MarkAsUsed({ id, user_id: rows.user_id }, client);
        await UserModel.MarkAsVerified(rows.user_id, client);
        await client.query("COMMIT");

        return;
    } catch (err) {
        console.log("Cannot verify Email", err);
        throw err;
    } finally {
        if (client) client.release();
    }
}

export async function forgotPassword(email) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const user_id = await UserModel.findByEmail(email);
        if (!user_id) {
            await client.query("COMMIT");
            return;
        }

        const { token, tokenHash, expiresAt, id } = TokenService.generatePasswordResetToken();
        const link = `${env.base_url}/api/auth/password-reset/${token}`;
        const text = "Reset your password";

        await passwordModel.MarkAllAsUsed(user_id, client);
        await passwordModel.storePasswordToken({ uuid: id, user_id, hashedToken: tokenHash, expires_at: expiresAt }, client);
        await sendVerificationEmail(email, link, text);

        await client.query("COMMIT");
        return { token: token };
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        client.release();
    }
}

export async function verifyPasswordToken(id, token) {
    const client = await pool.connect();
    try {
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
        const user_id = await passwordModel.verifyPasswordToken({ id, tokenHash }, client);
        assert(user_id, UnauthorizedError, "Password Token is not valid!");
        return { user_id };
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        client.release();
    }
}

export async function resetPassword({ id, newPassword, token }) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const tid = token.split(".")[0];
        await verifyPasswordToken(tid, token);

        const hashedPassword = await hashPassword(newPassword);
        await UserModel.updatePassword({ user_id: id, hashedPass: hashedPassword }, client);
        await passwordModel.MarkAllAsUsed(id, client);

        await client.query("COMMIT");
        return;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        client.release();
    }

}