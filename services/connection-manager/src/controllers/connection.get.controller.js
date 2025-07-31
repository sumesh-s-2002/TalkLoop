import { getConnection } from "../services/connection.services.js";
import {assert, BadRequestError} from "../../shared/utils/httpErrors.js"

export async function getConnectionHandler(req, res, next) {
    const userId = req.params.user_id;
    try {
        console.log("user id is : " ,userId);
        assert(userId, BadRequestError, "Cannot find user_id");
        const serverInfo = await getConnection(userId);

        if (!serverInfo) {
            return res.status(404).json({ error: `No connection found for user ${userId}` });
        }

        res.status(200).json(serverInfo); 
    } catch (err) {
        console.error("Something went wrong at getConnectionHandler:", err);
        next(err);
    }
}
