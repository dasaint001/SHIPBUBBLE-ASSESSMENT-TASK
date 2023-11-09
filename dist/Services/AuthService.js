"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const BusTicketing_1 = require("../Database/BusTicketing");
const moment_1 = __importDefault(require("moment"));
const node_input_validator_1 = require("node-input-validator");
const bcrypt = __importStar(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const STATUS_PENDING = 'PENDING';
const timeStamp = (0, moment_1.default)().format(TIME_FORMAT).toString();
const AuthService = {
    createUser: (request, response) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validator = new node_input_validator_1.Validator(request.body, {
                userName: 'required',
                phoneNumber: 'required|numeric',
                password: 'required',
            });
            const salt = 10;
            const hashedPassword = yield bcrypt.hash(request.body.password, salt);
            const matched = yield validator.check();
            if (!matched) {
                return response.status(422).json({
                    status: 'Failed',
                    message: 'Validation Failed',
                    data: validator.errors,
                });
            }
            const isPhoneExist = yield BusTicketing_1.BusTicketing.User.findOne({
                where: {
                    phoneNumber: request.body.phoneNumber,
                },
            });
            if (isPhoneExist) {
                return response.status(400).json({
                    status: 'Failed',
                    message: 'Phone number already in use',
                });
            }
            const user = yield BusTicketing_1.BusTicketing.User.create({
                userName: request.body.userName,
                phoneNumber: request.body.phoneNumber,
                password: hashedPassword,
                CreatedAt: timeStamp,
                UpdatedAt: timeStamp,
            });
            const wallet = yield BusTicketing_1.BusTicketing.Wallet.create({
                UserID: user.ID,
                Balance: '1000',
                CreatedAt: timeStamp,
                UpdatedAt: timeStamp,
            });
            return response.status(201).json({
                status: 'Successful',
                message: 'User created Successfully',
                data: { user, wallet },
            });
        }
        catch (error) {
            return response.status(400).json({
                status: 'Failed',
                message: error.message,
                data: null,
            });
        }
    }),
    login: (request, response) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validator = new node_input_validator_1.Validator(request.body, {
                phoneNumber: 'required',
                password: 'required',
            });
            const matched = yield validator.check();
            if (!matched) {
                return response.status(422).json({
                    status: 'Failed',
                    message: 'Validation Failed',
                    data: validator.errors,
                });
            }
            const salt = 10;
            const user = request.body;
            const { phoneNumber, password } = user;
            const isUserExist = yield BusTicketing_1.BusTicketing.User.findOne({ where: { phoneNumber: phoneNumber } });
            if (!isUserExist) {
                return response.status(404).json({
                    status: 'Failed',
                    message: 'User not found',
                });
            }
            const isPasswordMatched = yield bcrypt.compare(password, isUserExist.password);
            if (!isPasswordMatched) {
                return response.status(400).json({
                    status: 'Failed',
                    message: 'Wrong password',
                });
            }
            const token = jsonwebtoken_1.default.sign({ ID: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.ID, phoneNumber: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.phoneNumber }, 'YOUR_SECRET', {
                expiresIn: '1d',
            });
            return response.status(201).json({
                status: 'Successful',
                message: 'Login successfully',
                data: token,
            });
        }
        catch (error) {
            return response.status(400).json({
                status: 'Failed',
                message: error.message,
            });
        }
    }),
};
module.exports = AuthService;
