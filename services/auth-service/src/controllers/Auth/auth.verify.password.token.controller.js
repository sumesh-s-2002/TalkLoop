import { assert } from "../../../shared/utils/httpErrors.js"
import { verifyPasswordToken } from "../../services/auth.services.js";

export async function verifyPasswordTokenController(req, res, next) {
    const token = req.params.token;
    try {
        assert(token, "Token is missing");
        const id = token.split(".")[0];
        const user_id = await verifyPasswordToken(id, token);
        return res.status(200).json({ user_id });
    } catch (e) {
        return next(e);
    }
}