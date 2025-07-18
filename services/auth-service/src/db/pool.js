import { Pool } from "pg"
import { env } from "../config/env.js";

const pool = new Pool({
    connectionString: env.dbUrl,
    max: 10,
    idleTimeoutMillis: 10000
});

export default pool;