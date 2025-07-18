import { assert } from "../../../shared/utils/httpErrors.js";
import { refresh } from "../../services/auth.services.js";

export async function refreshController(req, res, next) {
    const data = req.body;
    try {
        assert(data && data.refresh_token, "Provide refresh Token");
        const jti = data.refresh_token.split(".")[0];
        const { accessToken, refreshToken } = await refresh(jti);
        return res.status(200).json({ accessToken, refreshToken });
    } catch (e) {
        return next(e);
    }
}