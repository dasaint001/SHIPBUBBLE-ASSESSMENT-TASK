"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.SECRET_KEY = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.SECRET_KEY = 'YOUR_SECRET';
const auth = (request, response, next) => {
    var _a;
    try {
        const token = (_a = request.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token) {
            throw new Error();
        }
        const decoded = jsonwebtoken_1.default.verify(token, exports.SECRET_KEY);
        request.token = decoded;
        next();
    }
    catch (err) {
        response.status(401).json({
            status: 'Failed',
            message: 'Please authenticate',
        });
    }
};
exports.auth = auth;
