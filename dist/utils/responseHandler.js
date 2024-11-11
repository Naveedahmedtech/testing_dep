"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendErrorResponse = exports.sendSuccessResponse = void 0;
const constants_1 = require("../constants");
const sendSuccessResponse = (res, message, result = null, statusCode = 200, code = constants_1.RESPONSE_CODES.SUCCESS) => {
    res.status(statusCode).json({
        success: true,
        statusCode,
        code,
        message,
        result,
    });
};
exports.sendSuccessResponse = sendSuccessResponse;
const sendErrorResponse = (res, message, statusCode = 500, stack = null, errors = []) => {
    let code;
    switch (statusCode) {
        case 400:
            code = constants_1.RESPONSE_CODES.BAD_REQUEST;
            break;
        case 401:
            code = constants_1.RESPONSE_CODES.UNAUTHORIZED;
            break;
        case 403:
            code = constants_1.RESPONSE_CODES.FORBIDDEN;
            break;
        case 404:
            code = constants_1.RESPONSE_CODES.NOT_FOUND;
            break;
        case 409:
            code = constants_1.RESPONSE_CODES.CONFLICT;
            break;
        case 422:
            code = constants_1.RESPONSE_CODES.UNPROCESSABLE_ENTITY;
            break;
        case 413:
            code = constants_1.RESPONSE_CODES.PAYLOAD_TOO_LARGE;
            break;
        case 423:
            code = constants_1.RESPONSE_CODES.LOCKED;
            break;
        case 429:
            code = constants_1.RESPONSE_CODES.TOO_MANY_REQUESTS;
            break;
        case 201:
            code = constants_1.RESPONSE_CODES.CREATED;
            break;
        case 202:
            code = constants_1.RESPONSE_CODES.ACCEPTED;
            break;
        case 204:
            code = constants_1.RESPONSE_CODES.NO_CONTENT;
            break;
        case 500:
        default:
            code = constants_1.RESPONSE_CODES.INTERNAL_SERVER_ERROR;
            break;
    }
    const response = {
        success: false,
        statusCode,
        code,
        message,
        errors,
    };
    if (process.env.NODE_ENV !== "prod" && stack) {
        response.stack = stack;
    }
    res.status(statusCode).json(response);
};
exports.sendErrorResponse = sendErrorResponse;
