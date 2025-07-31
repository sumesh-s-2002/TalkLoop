import jwt from "jsonwebtoken" 
import { assert, BadRequestError } from "../../shared/utils/httpErrors.js"
import { env } from '../config/env.js';

const socketAuthMiddleware = (socket, next) => {
  const token = socket.handshake.auth?.token;
  console.log("reached middleware");
  try {
    assert(token, BadRequestError, "Cannot find the token in the request");
    const payload = jwt.verify(token, env.jwt_secret); 
    socket.user = payload; 
    next(); 
  } catch (err) {
    next(err);
  }
};

export default socketAuthMiddleware;


