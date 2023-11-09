"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReference = exports.generateNumber = exports.trimModelAttributes = void 0;
const trimModelAttributes = (model) => {
    Object.keys(model.dataValues).forEach((key) => {
        if (typeof model.dataValues[key] === 'string') {
            model.dataValues[key] = model.dataValues[key].trim();
        }
    });
    return JSON.parse(JSON.stringify(model));
};
exports.trimModelAttributes = trimModelAttributes;
const generateNumber = () => {
    const randomID = Math.floor(Math.random() * 100);
    return randomID;
};
exports.generateNumber = generateNumber;
const generateReference = (length) => {
    const referenceID = new Date().getTime().toString().slice(-length);
    return referenceID;
};
exports.generateReference = generateReference;
