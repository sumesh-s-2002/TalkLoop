import { assert, BadRequestError } from "../../../shared/utils/httpErrors.js";
import { signup } from "../../services/auth.services.js";

export async function signupController(req, res, next) {
    const data = req.body;
    try {
        assert(data && data.email,BadRequestError,"Email is Required!");
        assert(data && data.username,BadRequestError, "Username is required");
        assert(data && data.password,BadRequestError,"Password is required");

        const { accesToken, refreshToken } = await signup({ email: data.email, username: data.username, password: data.password });
        return res.status(201).json({ accessToken : accesToken, refreshToken });
    } catch (e) {
        return next(e);
    }
}
