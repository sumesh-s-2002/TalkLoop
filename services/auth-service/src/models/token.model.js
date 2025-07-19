import pool from "../db/pool.js";
import  { BadRequestError, UnauthorizedError } from "../../shared/utils/httpErrors.js"

export async function storeRefreshToken({ userId, tokenHash, expiresAt, jti }, client) {
    const query = `
        INSERT INTO refresh_tokens (jti ,user_id, token_hash, expires_at)
        VALUES ($1 ,$2, $3, $4)
    `
    try {
        const { rowCount, rows } = await client.query(query, [jti, userId, tokenHash, expiresAt]);
        if (rowCount != 1) {
            throw new Error("refresh Token Insertion failed");
        }
    } catch (err) {
        console.error("store refresh token error:", err);
        throw err;
    }
}

export async function MarkAsRevoked({ jti }, client) {
    const query = `
        UPDATE refresh_tokens
            SET revoked = true
        WHERE jti = $1;
    `
    try {
        const { rowCount } = await client.query(query, [jti]);
        if (rowCount != 1) throw Error("invalide refresh token");
    } catch (err) {
        console.log(e);
    }
}

export async function validateRefreshToken({ jti }, client) {
    const query = `
        SELECT user_id FROM refresh_tokens
        WHERE jti = $1
        AND revoked = false
        AND expires_at > now()
        FOR UPDATE;
    `
    try {
        const { rowCount, rows } = await client.query(query, [jti]);
        if (rowCount != 1) return null;
        return rows[0].user_id;
    } catch (err) {
        console.log(err);
    }
}
