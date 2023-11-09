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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BusTickettingApiService_1 = __importDefault(require("./Services/BusTickettingApiService"));
const AuthService_1 = __importDefault(require("./Services/AuthService"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("./middleware/auth");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const port = process.env.PORT;
app.get('/', (_request, response) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('This is it');
    return response.json({
        status: 'Successful',
        message: 'Everything is ok with my health.',
        data: null,
    });
}));
app.post('/register', AuthService_1.default.createUser);
app.post('/login', AuthService_1.default.login);
app.post('/ticket/create', auth_1.auth, BusTickettingApiService_1.default.createBusTicket);
app.post('/user/transfer-fund', auth_1.auth, BusTickettingApiService_1.default.creditAccount);
app.post('/ticket/buy', auth_1.auth, BusTickettingApiService_1.default.buyTicket);
app.get('/user/balance', auth_1.auth, BusTickettingApiService_1.default.getBalance);
app.get('/user/transactions', auth_1.auth, BusTickettingApiService_1.default.getTransactions);
app.listen(port, () => console.log(`⚡️[server]: Magic happens on port ${port}`));
