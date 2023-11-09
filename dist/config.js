"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATABASE_PORT = exports.DATABASE_PASSWORD = exports.DATABASE_USERNAME = exports.DATABASE_NAME = exports.DATABASE_HOST = exports.APP_ENV = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.APP_ENV = (_a = process.env.ENV) !== null && _a !== void 0 ? _a : 'local';
// DB
exports.DATABASE_HOST = (_b = process.env.DATABASE_HOST) !== null && _b !== void 0 ? _b : '';
exports.DATABASE_NAME = (_c = process.env.DATABASE_NAME) !== null && _c !== void 0 ? _c : '';
exports.DATABASE_USERNAME = (_d = process.env.DATABASE_USERNAME) !== null && _d !== void 0 ? _d : '';
exports.DATABASE_PASSWORD = (_e = process.env.DATABASE_PASSWORD) !== null && _e !== void 0 ? _e : '';
exports.DATABASE_PORT = (_f = process.env.DATABASE_PORT) !== null && _f !== void 0 ? _f : '';
