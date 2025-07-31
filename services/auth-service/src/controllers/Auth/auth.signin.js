import { assert, BadRequestError} from "../../../shared/utils/httpErrors.js";
import { signin } from "../../services/auth.services.js";

export async function signinController(req, res, next) {
    const data = req.body;
    try {
        assert(data && data.username,BadRequestError, "Username is required");
        assert(data && data.password,BadRequestError, "Password is required");
        const { accessToken, refreshToken, user } = await signin({ username: data.username, password: data.password });
        return res.status(200).json({ accessToken, refreshToken, user});
    } catch (e) {
        return next(e);
    }
}