import http from "node:http"
import process from "node:process"
import app from "./app.js"
import { env } from "./config/env.js";
import pool from "./db/pool.js";
//cachewarm up

const server = http.createServer(app);

server.listen(env.port, () => {
    console.log(`Auth service listening to port 4000`);
});

//grateful shutdown
async function shutdown(signal) {
    console.log(`${signal} received, shutting down !`);
    server.close();
    pool.end();
    process.exit(0);
}

["SIGINT", "SIGTERM"].forEach(sig => {
    process.on(sig, () => shutdown(sig))
});


