import { assert, BadRequestError } from "../../../shared/utils/httpErrors.js"
import { forgotPassword } from "../../services/auth.services.js";

export async function forgotPasswordController(req, res, next) {
    const data = req.body;
    assert(data, BadRequestError, "email feild is empty!");
    try {
        const { token } = await forgotPassword(data.email);
        return res.status(200).json({ token });
    } catch (e) {
        return next(e);
    }
}