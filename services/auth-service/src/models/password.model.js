import pool from "../db/pool.js";

export async function storePasswordToken({ uuid, user_id, hashedToken, expires_at }, client) {
    const sql = `
        INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at)
        VALUES ($1, $2, $3, $4)
    `;
    try {
        const { rowCount } = await client.query(sql, [uuid, user_id, hashedToken, expires_at]);
        if (rowCount != 1) throw new Error("password verification Token Insertion Failed!");
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function MarkAsUsed({ id, user_id }, client) {
    const sql = `
        UPDATE password_reset_tokens 
        SET used = true
        WHERE user_id = $1 AND id = $2;
    `
    try {
        const { rowCount } = await client.query(sql, [user_id, id]);
        if (rowCount == 0) throw new Error("updation failed at password.model(MarkAsUsed)");
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function MarkAllAsUsed(user_id, client) {
    const sql = `
        UPDATE password_reset_tokens 
        SET used = true
        WHERE user_id = $1;
    `
    try {
        await client.query(sql, [user_id]);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function verifyPasswordToken({ id, tokenHash }, client) {
    const query = `
        SELECT user_id FROM password_reset_tokens
        WHERE id = $1
        AND token_hash = $2
        AND used = false
        AND expires_at > now()
    `
    try {
        const { rowCount, rows } = await client.query(query, [id, tokenHash]);
        if (rowCount != 1) return null;
        return rows[0].user_id;
    } catch (err) {
        console.log("Error verifing Password Token: ", err);
        throw err;
    }
}