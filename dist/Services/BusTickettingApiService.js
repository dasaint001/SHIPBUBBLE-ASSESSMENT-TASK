"use strict";
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
const Helpers_1 = require("../Helpers/Helpers");
const moment_1 = __importDefault(require("moment"));
const node_input_validator_1 = require("node-input-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sequelize_1 = require("sequelize");
const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD';
const STATUS_PENDING = 'PENDING';
const STATUS_SUCCESSFUL = 'SUCCESSFUL';
const CREDIT_TRANSACTION_TYPE = 'CREDIT';
const DEBIT_TRANSACTION_TYPE = 'DEBIT';
const timeStamp = (0, moment_1.default)().format(TIME_FORMAT).toString();
const BusTicketService = {
    createBusTicket: (request, response) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validator = new node_input_validator_1.Validator(request.body, {
                name: 'required',
                price: 'required|numeric',
            });
            const authheader = request.headers.authorization;
            const authUser = jsonwebtoken_1.default.decode(authheader);
            const ticket = request.body;
            const { name, price } = ticket;
            const matched = yield validator.check();
            if (!matched) {
                return response.status(422).json({
                    status: 'Failed',
                    message: 'Validation Failed',
                    data: validator.errors,
                });
            }
            const busTicket = yield BusTicketing_1.BusTicketing.Ticket.create({
                Name: name,
                UserID: authUser.ID,
                Price: price,
                TicketID: (name.slice(0, 2) + (0, Helpers_1.generateNumber)()).toUpperCase(),
                CreatedAt: timeStamp,
                UpdatedAt: timeStamp,
            });
            return response.status(201).json({
                status: 'Successful',
                message: 'Ticket created Successfully',
                data: busTicket,
            });
        }
        catch (error) {
            return response.status(400).json({
                status: 'Failed',
                message: error.message,
            });
        }
    }),
    creditAccount: (request, response) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validator = new node_input_validator_1.Validator(request.body, {
                userPhone: 'required',
                amount: 'required|numeric',
            });
            const authheader = request.headers.authorization;
            const authUser = jsonwebtoken_1.default.decode(authheader);
            const credit = request.body;
            const { userPhone, amount } = credit;
            const query = {
                where: {
                    phoneNumber: userPhone,
                },
            };
            const matched = yield validator.check();
            if (!matched) {
                return response.status(422).json({
                    status: 'Failed',
                    message: 'Validation Failed',
                    data: validator.errors,
                });
            }
            const isUserExist = yield BusTicketing_1.BusTicketing.User.findOne(query);
            if (!isUserExist) {
                return response.status(404).json({
                    status: 'Failed',
                    message: 'User not found',
                });
            }
            const wallet = yield BusTicketing_1.BusTicketing.Wallet.findOne({ where: { UserID: isUserExist.ID } });
            const creditData = {
                Balance: +wallet.Balance + amount,
            };
            const userReceipt = {
                beneficiaryName: isUserExist.userName,
                amount: amount,
            };
            yield BusTicketing_1.BusTicketing.Wallet.update(creditData, { where: { UserID: isUserExist.ID } });
            const transaction = yield BusTicketing_1.BusTicketing.Transaction.create({
                Reference: (0, Helpers_1.generateReference)(7),
                Quantity: 1,
                Type: CREDIT_TRANSACTION_TYPE,
                Amount: amount,
                Status: STATUS_SUCCESSFUL,
                UserID: isUserExist.userName,
                CreatedAt: timeStamp,
                UpdatedAt: timeStamp,
            });
            return response.status(201).json({
                status: 'Successful',
                message: 'User credited successfully',
                data: { userReceipt, transaction },
            });
        }
        catch (error) {
            return response.status(400).json({
                status: 'Failed',
                message: error.message,
            });
        }
    }),
    buyTicket: (request, response) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validator = new node_input_validator_1.Validator(request.body, {
                ticketName: 'required',
                quantity: 'required',
            });
            const matched = yield validator.check();
            if (!matched) {
                return response.status(422).json({
                    status: 'Failed',
                    message: 'Validation Failed',
                    data: validator.errors,
                });
            }
            const authheader = request.headers.authorization;
            const authUser = jsonwebtoken_1.default.decode(authheader);
            const userRequest = request.body;
            const { ticketName, quantity } = userRequest;
            const query = {
                where: {
                    Name: ticketName,
                },
            };
            const user = yield BusTicketing_1.BusTicketing.User.findOne({ where: { ID: authUser.ID } });
            const isTicketExist = yield BusTicketing_1.BusTicketing.Ticket.findOne(query);
            if (!isTicketExist) {
                return response.status(404).json({
                    status: 'Failed',
                    message: 'Ticket not found',
                });
            }
            const wallet = yield BusTicketing_1.BusTicketing.Wallet.findOne({ where: { UserID: authUser.ID } });
            if (+wallet.Balance < isTicketExist.Price * quantity) {
                return response.status(404).json({
                    status: 'Failed',
                    message: 'Insuffecient Balance',
                });
            }
            const creditData = {
                Balance: +wallet.Balance - isTicketExist.Price * quantity,
            };
            yield BusTicketing_1.BusTicketing.Wallet.update(creditData, { where: { UserID: authUser.ID } });
            const transaction = yield BusTicketing_1.BusTicketing.Transaction.create({
                Reference: (0, Helpers_1.generateReference)(7),
                Quantity: 1,
                Type: DEBIT_TRANSACTION_TYPE,
                Amount: +quantity * isTicketExist.Price,
                Status: STATUS_SUCCESSFUL,
                UserID: user.userName,
                CreatedAt: timeStamp,
                UpdatedAt: timeStamp,
            });
            return response.status(200).json({
                status: 'Successful',
                message: 'Ticket purchased successfully',
                data: transaction,
            });
        }
        catch (error) {
            return response.status(400).json({
                status: 'Failed',
                message: error.message,
            });
        }
    }),
    getBalance: (request, response) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const authheader = request.headers.authorization;
            const authUser = jsonwebtoken_1.default.decode(authheader);
            const query = {
                where: {
                    UserID: authUser.ID,
                },
            };
            const wallet = yield BusTicketing_1.BusTicketing.Wallet.findOne(query);
            return response.status(200).json({
                status: 'Successful',
                message: 'Balance successfully retrieved',
                data: wallet,
            });
        }
        catch (error) {
            return response.status(400).json({
                status: 'Failed',
                message: error.message,
            });
        }
    }),
    getTransactions: (request, response) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const authheader = request.headers.authorization;
            const authUser = jsonwebtoken_1.default.decode(authheader);
            const query = {
                where: {
                    ID: authUser.ID,
                },
            };
            const user = yield BusTicketing_1.BusTicketing.User.findOne(query);
            let transactionQuery = {
                where: {
                    UserID: user.userName,
                },
            };
            const startDate = request.query.startDate;
            const endDate = request.query.endDate;
            if (startDate && endDate) {
                transactionQuery = {
                    where: {
                        UserID: user.userName,
                        CreatedAt: {
                            [sequelize_1.Op.gte]: startDate,
                            [sequelize_1.Op.lte]: endDate,
                        },
                    },
                };
                const filteredTransactions = yield BusTicketing_1.BusTicketing.Transaction.findAll(transactionQuery);
                return response.status(200).json({
                    status: 'Successful',
                    message: 'Transactions successfully retrieved',
                    data: filteredTransactions,
                });
            }
            const transactions = yield BusTicketing_1.BusTicketing.Transaction.findAll(transactionQuery);
            return response.status(200).json({
                status: 'Successful',
                message: 'Transactions successfully retrieved',
                data: transactions,
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
module.exports = BusTicketService;
