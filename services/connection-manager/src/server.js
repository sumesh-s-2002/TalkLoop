
import http from "node:http"
import process from "node:process"
import app from "./app.js"
import redisClient from "./cache/reddis.client.js";
import env from "./config/env.js"

const server = http.createServer(app);

server.listen(env.port , '0.0.0.0' ,() => {
    console.log(`connection manager listening to port ${env.port}`);
});

//grateful shutdown
async function shutdown(signal) {
    console.log(`${signal} received, shutting down !`);
    server.close();
    await redisClient.quit();
    process.exit(0);
}

["SIGINT", "SIGTERM"].forEach(sig => {
    process.on(sig, () => shutdown(sig))
});


