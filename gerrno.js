
class gErrno extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

class BadRequestError extends gErrno {
    constructor(message = " Bad request") {
        super(message, 400);
    }
}
class UnauthorizedError extends gErrno {
    constructor(message = "Not authenticated") {
        super(message, 401);
    }
}

class ForbiddenError extends gErrno {
    constructor(message = 'Not authorized to perform this action') {
        super(message, 403);
    }
}

class NotFoundError extends gErrno {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

class ConflictError extends gErrno {
    constructor(message = 'Conflict with current state') {
        super(message, 409);
    }
}

class ValidationError extends gErrno {
    constructor(message = 'Invalid input data', errors = []) {
        super(message, 422);
        this.errors = errors;
    }
}

class TooManyRequestsError extends gErrno {
    constructor(message = 'Too many requests, slow down') {
        super(message, 429);
    }
}