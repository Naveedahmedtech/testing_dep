"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = exports.LIMITS = exports.RESPONSE_CODES = void 0;
exports.RESPONSE_CODES = {
    SUCCESS: "SUCCESS",
    BAD_REQUEST: "BAD_REQUEST",
    NOT_FOUND: "NOT_FOUND",
    UNAUTHORIZED: "UNAUTHORIZED",
    FORBIDDEN: "FORBIDDEN",
    INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
    CREATED: "CREATED",
    ACCEPTED: "ACCEPTED",
    NO_CONTENT: "NO_CONTENT",
    CONFLICT: "CONFLICT",
    UNPROCESSABLE_ENTITY: "UNPROCESSABLE_ENTITY",
    TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
    PAYLOAD_TOO_LARGE: "PAYLOAD_TOO_LARGE",
    LOCKED: "LOCKED",
};
exports.LIMITS = {
    FILE_SIZE: 2, //mb
    BODY_SIZE: "10mb",
};
exports.ENV = {
    JWT: {
        SECRET: process.env.JWT_SECRET || "jwt-secret"
    }
};
