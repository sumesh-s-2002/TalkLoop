import { assert } from "../../../shared/utils/httpErrors.js";
import { verifyEmail } from "../../services/auth.services.js";

export async function verifyEmailController(req, res, next) {
    const token = req.params.token;
    try {
        assert(token, "Token is missing");
        const id = token.split(".")[0];
        await verifyEmail(id, token);
        return res.status(200).end();
    } catch (e) {
        return next(e);
    }
}