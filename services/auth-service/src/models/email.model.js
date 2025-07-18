import pool from "../db/pool.js";

export async function storeVerificationToken({ uuid, user_id, hashedToken, expires_at }, client) {
    const sql = `
        INSERT INTO email_verification_tokens (id, user_id, token_hash, expires_at)
        VALUES ($1, $2, $3, $4)
    `;
    try {
        const { rowCount } = await client.query(sql, [uuid, user_id, hashedToken, expires_at]);
        if (rowCount != 1) throw new Error("Email verification Token Insertion Failed!");
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function MarkAsUsed({ id, user_id }, client) {
    const sql = `
        UPDATE email_verification_tokens 
        SET used = true
        WHERE user_id = $1 AND id = $2;
    `
    try {
        const { rowCount } = await client.query(sql, [user_id, id]);
        if (rowCount == 0) throw new Error("updation failed at email.model(MarkAsUsed)");
    } catch (err) {
        console.error(err);
        throw err;
    }
}


export async function validateToken(id, client) {
    const query = `
        SELECT user_id, token_hash FROM email_verification_tokens
        WHERE id = $1
        AND used = false
        AND expires_at > now()
        FOR UPDATE;
    `
    try {
        const { rowCount, rows } = await client.query(query, [id]);
        if (rowCount != 1) return null;
        return rows[0];
    } catch (err) {
        console.log(err);
    }
}