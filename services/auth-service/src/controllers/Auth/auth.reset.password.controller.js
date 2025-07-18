import { assert, BadRequestError } from "../../../shared/utils/httpErrors.js";
import { resetPassword } from "../../services/auth.services.js";

export async function passwordResetController(req, res, next) {
    const data = req.body;
    try {
        assert(data && data.user_id, BadRequestError, "user_id is missing!");
        assert(data && data.password, BadRequestError, "password is missing!");
        assert(data && data.token, BadRequestError, "token is missing!");

        await resetPassword({ id: data.user_id, token: data.token, newPassword: data.password });
        return res.status(200).end();
    } catch (e) {
        return next(e);
    }
}