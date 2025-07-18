import { assert } from "../../../shared/utils/httpErrors.js";
import { signin } from "../../services/auth.services.js";

export async function signinController(req, res, next) {
    const data = req.body;
    try {
        assert(data && data.username, "Username is required");
        assert(data && data.password, "Password is required");
        const { accessToken, refreshToken } = await signin({ username: data.username, password: data.password });
        return res.status(200).json({ accessToken, refreshToken });
    } catch (e) {
        return next(e);
    }
}