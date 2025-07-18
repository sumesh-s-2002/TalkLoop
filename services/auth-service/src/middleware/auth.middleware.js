import jwt from "jsonwebtoken"
import {UnauthorizedError} from  "../../shared/utils/httpErrors.js"
import { env } from "../config/env.js";

export function authMiddleware(req, res, next) {
    const header = req.headers.authorization || '';
    console.log(typeof header);
    if (header.length === 0) next(new UnauthorizedError("Aceess token is not provided in the header!"));
    const token = header.split(' ')[1];
    try {
        const decoded = jwt.verify(token, env.jwt_secret);
        req.user = {
            id: decoded.userId
        }
        return next();
    } catch (err) {
        return next(new UnauthorizedError("Invalid or expired token"));
    }
}