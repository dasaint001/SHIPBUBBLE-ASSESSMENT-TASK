"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionModel = exports.TicketModel = exports.WalletModel = exports.UserModel = void 0;
const sequelize_1 = require("sequelize");
const UserModel = (sequelize) => {
    const attributes = {
        ID: {
            type: sequelize_1.DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        userName: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        phoneNumber: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        password: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        CreatedAt: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        UpdatedAt: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    };
    return sequelize.define('User', attributes, {
        timestamps: false,
    });
};
exports.UserModel = UserModel;
const WalletModel = (sequelize) => {
    const attributes = {
        ID: {
            type: sequelize_1.DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        UserID: { type: sequelize_1.DataTypes.BIGINT, allowNull: true },
        Balance: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        CreatedAt: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        UpdatedAt: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    };
    return sequelize.define('Wallet', attributes, {
        timestamps: false,
    });
};
exports.WalletModel = WalletModel;
const TicketModel = (sequelize) => {
    const attributes = {
        ID: {
            type: sequelize_1.DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        Name: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        UserID: { type: sequelize_1.DataTypes.BIGINT, allowNull: true },
        TicketID: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        Price: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        CreatedAt: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        UpdatedAt: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    };
    return sequelize.define('Ticket', attributes, {
        timestamps: false,
    });
};
exports.TicketModel = TicketModel;
const TransactionModel = (sequelize) => {
    const attributes = {
        ID: {
            type: sequelize_1.DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        Reference: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        Quantity: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        UserID: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        Type: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        Status: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        Amount: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        CreatedAt: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        UpdatedAt: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    };
    return sequelize.define('Transaction', attributes, {
        timestamps: false,
    });
};
exports.TransactionModel = TransactionModel;
