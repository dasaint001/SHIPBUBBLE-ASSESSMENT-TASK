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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusTicketing = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
const Models_1 = require("./Models");
exports.BusTicketing = {};
const initialize = () => __awaiter(void 0, void 0, void 0, function* () {
    const sequelize = new sequelize_1.Sequelize(config_1.DATABASE_NAME, config_1.DATABASE_USERNAME, config_1.DATABASE_PASSWORD, {
        host: config_1.DATABASE_HOST,
        dialect: 'mysql',
        port: 3306,
        logging: false,
    });
    exports.BusTicketing.sequelize = sequelize;
    exports.BusTicketing.User = (0, Models_1.UserModel)(sequelize);
    exports.BusTicketing.Wallet = (0, Models_1.WalletModel)(sequelize);
    exports.BusTicketing.Transaction = (0, Models_1.TransactionModel)(sequelize);
    exports.BusTicketing.Ticket = (0, Models_1.TicketModel)(sequelize);
    yield sequelize.sync();
});
initialize();
