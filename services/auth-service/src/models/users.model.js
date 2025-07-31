import pool from "../db/pool.js";

//create user
export async function insertUser({ username, email, passwordHash }, client) {
    const sql = `
        INSERT INTO users (email, username, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id
    `;
    const { rows } = await client.query(sql, [email, username, passwordHash]);
    return rows[0].id;
}

export async function disableUser(username) {
    await pool.query(
        `UPDATE users SET is_active = FALSE, updated_at SS= now() WHERE username = $1`, [username]
    );
}

export async function findByEmail(email, client) {
    const sql = `SELECT id FROM users WHERE email = $1 LIMIT 1`;
    const { rows } = await client.query(sql, [email]);
    if (rows.length === 0) return null;
    return rows[0].id;
}

export async function findByUsername(username) {
    const sql = `SELECT * FROM users WHERE username = $1 LIMIT 1`;
    const { rows } = await pool.query(sql, [username]);
    if (rows.length != 1) return null;
    return rows[0].id;
}

export async function MarkAsVerified(user_id, client) {
    const sql = `
        UPDATE users 
        SET verified = true
        WHERE id = $1;
    `
    try {
        const { rowCount } = await client.query(sql, [user_id]);
        if (rowCount == 0) throw new Error("updation failed at user.model(MarkAsVerified)");
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function updatePassword({ user_id, hashedPass }, client) {
    const sql = `
        UPDATE users 
        SET password_hash = $1
        WHERE id = $2;
    `
    try {
        const { rowCount } = await client.query(sql, [hashedPass, user_id]);
        if (rowCount == 0) throw new Error("updation failed at user.model(updatePassword)");
    } catch (err) {
        console.error(err);
        throw err;
    }
}