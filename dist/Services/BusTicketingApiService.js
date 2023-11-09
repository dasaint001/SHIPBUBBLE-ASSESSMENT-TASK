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
const moment_1 = __importDefault(require("moment"));
const node_input_validator_1 = require("node-input-validator");
const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const STATUS_PENDING = 'PENDING';
const BusTicketService = {
    createJob: (request, response) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validator = new node_input_validator_1.Validator(request.body, {
                userName: 'required',
                phoneNumber: 'required|numeric',
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
            const timeStamp = (0, moment_1.default)().format(TIME_FORMAT).toString();
            const priceUpdateJob = yield BusTicketing_1.BusTicketing.User.create({
                userName: request.body.userName,
                phoneNumber: request.body.phoneNumber,
                password: request.body.password,
                CreatedAt: timeStamp,
                UpdatedAt: timeStamp,
            });
            // for (const item of request.body.Items) {
            // 	const DBItem = await GNLDReporting.Item.findOne({ where: { ItemCode: item.ItemCode } })
            // 	await GNLDReporting.PriceUpdateJobItem.create({
            // 		PriceUpdateJobID: priceUpdateJob.ID,
            // 		ItemCode: item.ItemCode,
            // 		ItemDescription: DBItem.ItemDescription,
            // 		DPInclusive: item.DPInclusive,
            // 		SRPInclusive: item.SRPInclusive,
            // 		MemberInclusive: item.MemberInclusive,
            // 		PV: item.PV,
            // 		BV: item.BV,
            // 		DPExclusive: GetExclusive(priceUpdateJob.VatPercentage, item.DPInclusive),
            // 		MemberExclusive: GetExclusive(priceUpdateJob.VatPercentage, item.MemberInclusive),
            // 		SRPExclusive: GetExclusive(priceUpdateJob.VatPercentage, item.SRPInclusive),
            // 		EmployeeInclusive: GetEmployeeInclusive(item.DPInclusive),
            // 		EmployeeExclusive: GetExclusive(priceUpdateJob.VatPercentage, GetEmployeeInclusive(item.DPInclusive)),
            // 		Status: STATUS_PENDING,
            // 		Error: null,
            // 		Meta: null,
            // 		CreatedAt: timeStamp,
            // 		UpdatedAt: timeStamp,
            // 	})
            // }
            return response.status(200).json({
                status: 'Successful',
                message: 'Job created Successfully',
                data: priceUpdateJob,
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
    // 	cancelPendingOrders: async (request: Request, response: Response) => {
    // 		try {
    // 			const pendingOrders = await GNLDReporting.sequelize.query(
    // 				`select
    // 					orders.orderid,
    // 					max(orders.country) as country,
    // 					max(orders.orderstatusid) as orderstatusid,
    // 					max(orders.orderdate) as orderdate
    // 				from orders
    // 				join priceupdatejobs on priceupdatejobs.phoneNumber = orders.country
    // 				where priceupdatejobs.status = 'PENDING'
    // 				and orders.orderstatusid in (0, 1)
    // 				group by orders.orderid`
    // 			)
    // 			for (const order of pendingOrders[0]) {
    // 				await ExigoAPI.cancelOrder(order.orderid)
    // 			}
    // 			return response.json({
    // 				status: 'Successful',
    // 				message: `${pendingOrders.length} Orders found to cancel`,
    // 				data: null,
    // 			})
    // 		} catch (error: any) {
    // 			return response.status(400).json({
    // 				status: 'Failed',
    // 				message: error.message,
    // 				data: null,
    // 			})
    // 		}
    // 	},
    // 	updatePrices: async (request: Request, response: Response) => {
    // 		try {
    // 			const query = {
    // 				where: {
    // 					Status: STATUS_PENDING,
    // 				},
    // 				limit: 1,
    // 				order: [['ID', 'DESC']],
    // 			}
    // 			const pendingPriceUpdateJob = await GNLDReporting.PriceUpdateJob.findOne(query)
    // 			if (!pendingPriceUpdateJob) {
    // 				return response.json({
    // 					status: 'Successful',
    // 					message: `No pending record found`,
    // 					data: null,
    // 				})
    // 			}
    // 			const pendingPriceUpdateJobItems = await GNLDReporting.PriceUpdateJobItem.findAll({
    // 				where: {
    // 					PriceUpdateJobID: pendingPriceUpdateJob[0].ID,
    // 					Status: STATUS_PENDING,
    // 				},
    // 			})
    // 			for (const priceUpdateJobItem of pendingPriceUpdateJobItems) {
    // 				const updatePriceJob = await GNLDReporting.PriceUpdateJob.findOne({ where: { ID: priceUpdateJobItem.PriceUpdateJobID } })
    // 				const retailPriceUpdate: any = await ExigoAPI.updateItemPrice(
    // 					priceUpdateJobItem.ItemCode,
    // 					'1',
    // 					'1',
    // 					updatePriceJob.CurrencyCode,
    // 					priceUpdateJobItem.BV,
    // 					priceUpdateJobItem.PV,
    // 					'1'
    // 				)
    // 				if (retailPriceUpdate.status === 200) {
    // 					await priceUpdateJobItem.update({ Status: 'SUCCESSFUL' })
    // 				} else {
    // 					await priceUpdateJobItem.update({ Status: 'FAILED' })
    // 				}
    // 			}
    // 			return response.json({
    // 				status: 'Successful',
    // 				message: 'Items updated successfully',
    // 				data: pendingPriceUpdateJobItems,
    // 			})
    // 		} catch (error: any) {
    // 			return response.status(400).json({
    // 				status: 'Failed',
    // 				message: error.message,
    // 				data: null,
    // 			})
    // 		}
    // 	},
};
module.exports = BusTicketService;
