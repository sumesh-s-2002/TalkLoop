import { assert } from "../../../shared/utils/httpErrors.js";
import { logout } from "../../services/auth.services.js";

export async function logoutController(req, res, next) {
    const data = req.body;
    try {
        assert(data && data.refresh_token, "Provide refresh Token");
        const jti = data.refresh_token.split(".")[0];
        await logout(jti);
        return res.status(200).end();
    } catch (e) {
        return next(e);
    }
}