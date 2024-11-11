"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const responseHandler_1 = require("../../utils/responseHandler");
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((detail) => detail.message);
            return (0, responseHandler_1.sendErrorResponse)(res, "Validation failed", 400, null, errors);
        }
        next();
    };
};
exports.validateRequest = validateRequest;
