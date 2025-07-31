import redisClient from "../cache/reddis.client.js";
import {assert, NotFoundError} from "../../shared/utils/httpErrors.js"

export async function setConnection({userId, serverId, socketId}){
    try{
        const value = JSON.stringify({serverId, socketId});
        await redisClient.set(userId ,value);
    }catch (err) {
        console.error(`Cannot set connection for user ${userId}`, err);
        throw err;
    }
}           

export async function getConnection(userId) {
    try {
        const data = await redisClient.get(userId);
        if (!data) {
            console.warn(`No connection data found for user ${userId}`);
            return null;
        }
        return JSON.parse(data);
    } catch (err) {
        console.error(`cannot get get server_id for user ${userId}`, err);
        throw err;
    }
}

export async function closeConnection({ userId }) {
    try {
        const result = await redisClient.del(userId);
        if (result === 1) {
            console.log(`Connection for user ${userId} removed from Redis.`);
        } else {
            console.warn(`No Redis entry found for user ${userId}.`);
        }
    } catch (err) {
        console.error(`Failed to delete Redis entry for user ${userId}:`, err);
        throw err;
    }
}
