"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiterMiddleware = void 0;
const responseHandler_1 = require("../utils/responseHandler");
const limiter_1 = require("limiter");
const limiter = new limiter_1.RateLimiter({ tokensPerInterval: 100, interval: "hour" });
const rateLimiterMiddleware = async (req, res, next) => {
    try {
        const remainingRequests = await limiter.removeTokens(1);
        if (remainingRequests < 0) {
            (0, responseHandler_1.sendErrorResponse)(res, "Too many requests, please try again later!", 429);
        }
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.rateLimiterMiddleware = rateLimiterMiddleware;
