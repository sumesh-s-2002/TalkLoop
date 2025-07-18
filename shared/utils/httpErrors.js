export class HttpError extends Error{
    constructor(status, message){
        super(message);
        this.status = status;
    }
}

export class BadRequestError extends HttpError {
    constructor(msg = "BadRequest"){
        super(400, msg);
    }
}

export class UnauthorizedError extends HttpError {
    constructor(msg = "UauthorizedError"){
        super(401, msg);
    }
}

export class ForbiddenError extends HttpError{
    constructor(msg = "ForbiddenError"){
        super(403, msg);
    }
}

export class NotFoundError extends HttpError{
    constructor(msg = "NotFoundError"){
        super(404, msg);
    }
}

export class ConflictError extends HttpError{
    constructor(msg = "Conflict Error"){
        super(409, msg);
    }
}

export class TooManyRequestsError extends HttpError{
    constructor(msg = "Too many requests"){
        super(429, msg)
    }
}

export class InternalServerError extends HttpError {
    constructor(msg = "Internal server Error"){
        super(500, msg);
    }
}

export function createHttpError(status, message){
    return new HttpError(status, message);
}

export function assert(condition, ErrorClass = BadRequestError, msg){
    if(!condition) throw new ErrorClass(msg);
}