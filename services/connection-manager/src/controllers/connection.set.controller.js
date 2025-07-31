import { setConnection } from "../services/connection.services.js";
import {assert, BadRequestError} from "../../shared/utils/httpErrors.js"

export async function setConnectionHandler(req, res, next) {
    try {
        const {userId, serverId, socketId} = req.body;
        assert(userId && serverId && socketId, BadRequestError, "userId || serverId || socketId not found in setconnection");
        await setConnection({userId, serverId, socketId});
        res.status(200).json({message: "connection established"});
    } catch (err) {
        console.error("Something went wrong at getConnectionHandler:", err);
        next(err);
    }
}