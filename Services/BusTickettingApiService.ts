import { BusTicketing } from '../Database/BusTicketing'
import { generateNumber, generateReference } from '../Helpers/Helpers'
import { Request, Response } from 'express'
import moment from 'moment'
import { Validator } from 'node-input-validator'
import jwt from 'jsonwebtoken'
import { Op } from 'sequelize'

const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
const DATE_FORMAT = 'YYYY-MM-DD'
const STATUS_PENDING = 'PENDING'
const STATUS_SUCCESSFUL = 'SUCCESSFUL'
const CREDIT_TRANSACTION_TYPE = 'CREDIT'
const DEBIT_TRANSACTION_TYPE = 'DEBIT'
const timeStamp = moment().format(TIME_FORMAT).toString()

const BusTicketService = {
	createBusTicket: async (request: Request, response: Response) => {
		try {
			const validator = new Validator(request.body, {
				name: 'required',
				price: 'required|numeric',
			})

			const authheader: any = request.headers.authorization

			const authUser: any = jwt.decode(authheader)

			const ticket = request.body

			const { name, price } = ticket

			const matched = await validator.check()
			if (!matched) {
				return response.status(422).json({
					status: 'Failed',
					message: 'Validation Failed',
					data: validator.errors,
				})
			}

			const busTicket = await BusTicketing.Ticket.create({
				Name: name,
				UserID: authUser.ID,
				Price: price,
				TicketID: (name.slice(0, 2) + generateNumber()).toUpperCase(),
				CreatedAt: timeStamp,
				UpdatedAt: timeStamp,
			})

			return response.status(201).json({
				status: 'Successful',
				message: 'Ticket created Successfully',
				data: busTicket,
			})
		} catch (error: any) {
			return response.status(400).json({
				status: 'Failed',
				message: error.message,
			})
		}
	},
	creditAccount: async (request: Request, response: Response) => {
		try {
			const validator = new Validator(request.body, {
				userPhone: 'required',
				amount: 'required|numeric',
			})

			const authheader: any = request.headers.authorization

			const authUser: any = jwt.decode(authheader)

			const credit = request.body

			const { userPhone, amount } = credit

			const query = {
				where: {
					phoneNumber: userPhone,
				},
			}

			const matched = await validator.check()
			if (!matched) {
				return response.status(422).json({
					status: 'Failed',
					message: 'Validation Failed',
					data: validator.errors,
				})
			}

			const isUserExist = await BusTicketing.User.findOne(query)

			if (!isUserExist) {
				return response.status(404).json({
					status: 'Failed',
					message: 'User not found',
				})
			}

			const wallet = await BusTicketing.Wallet.findOne({ where: { UserID: isUserExist.ID } })

			const creditData: any = {
				Balance: +wallet.Balance + amount,
			}

			const userReceipt: any = {
				beneficiaryName: isUserExist.userName,
				amount: amount,
			}

			await BusTicketing.Wallet.update(creditData, { where: { UserID: isUserExist.ID } })

			const transaction = await BusTicketing.Transaction.create({
				Reference: generateReference(7),
				Quantity: 1,
				Type: CREDIT_TRANSACTION_TYPE,
				Amount: amount,
				Status: STATUS_SUCCESSFUL,
				UserID: isUserExist.userName,
				CreatedAt: timeStamp,
				UpdatedAt: timeStamp,
			})

			return response.status(201).json({
				status: 'Successful',
				message: 'User credited successfully',
				data: { userReceipt, transaction },
			})
		} catch (error: any) {
			return response.status(400).json({
				status: 'Failed',
				message: error.message,
			})
		}
	},
	buyTicket: async (request: Request, response: Response) => {
		try {
			const validator = new Validator(request.body, {
				ticketName: 'required',
				quantity: 'required',
			})

			const matched = await validator.check()
			if (!matched) {
				return response.status(422).json({
					status: 'Failed',
					message: 'Validation Failed',
					data: validator.errors,
				})
			}

			const authheader: any = request.headers.authorization

			const authUser: any = jwt.decode(authheader)

			const userRequest = request.body

			const { ticketName, quantity } = userRequest

			const query = {
				where: {
					Name: ticketName,
				},
			}

			const user = await BusTicketing.User.findOne({ where: { ID: authUser.ID } })
			const isTicketExist = await BusTicketing.Ticket.findOne(query)

			if (!isTicketExist) {
				return response.status(404).json({
					status: 'Failed',
					message: 'Ticket not found',
				})
			}

			const wallet = await BusTicketing.Wallet.findOne({ where: { UserID: authUser.ID } })

			if (+wallet.Balance < isTicketExist.Price * quantity) {
				return response.status(404).json({
					status: 'Failed',
					message: 'Insuffecient Balance',
				})
			}

			const creditData: any = {
				Balance: +wallet.Balance - isTicketExist.Price * quantity,
			}

			await BusTicketing.Wallet.update(creditData, { where: { UserID: authUser.ID } })

			const transaction = await BusTicketing.Transaction.create({
				Reference: generateReference(7),
				Quantity: 1,
				Type: DEBIT_TRANSACTION_TYPE,
				Amount: +quantity * isTicketExist.Price,
				Status: STATUS_SUCCESSFUL,
				UserID: user.userName,
				CreatedAt: timeStamp,
				UpdatedAt: timeStamp,
			})

			return response.status(200).json({
				status: 'Successful',
				message: 'Ticket purchased successfully',
				data: transaction,
			})
		} catch (error: any) {
			return response.status(400).json({
				status: 'Failed',
				message: error.message,
			})
		}
	},
	getBalance: async (request: Request, response: Response) => {
		try {
			const authheader: any = request.headers.authorization

			const authUser: any = jwt.decode(authheader)

			const query = {
				where: {
					UserID: authUser.ID,
				},
			}

			const wallet = await BusTicketing.Wallet.findOne(query)

			return response.status(200).json({
				status: 'Successful',
				message: 'Balance successfully retrieved',
				data: wallet,
			})
		} catch (error: any) {
			return response.status(400).json({
				status: 'Failed',
				message: error.message,
			})
		}
	},
	getTransactions: async (request: Request, response: Response) => {
		try {
			const authheader: any = request.headers.authorization

			const authUser: any = jwt.decode(authheader)

			const query = {
				where: {
					ID: authUser.ID,
				},
			}

			const user = await BusTicketing.User.findOne(query)

			let transactionQuery: any = {
				where: {
					UserID: user.userName,
				},
			}
			const startDate = request.query.startDate
			const endDate = request.query.endDate

			if (startDate && endDate) {
				transactionQuery = {
					where: {
						UserID: user.userName,
						CreatedAt: {
							[Op.gte]: startDate,
							[Op.lte]: endDate,
						},
					},
				}

				const filteredTransactions = await BusTicketing.Transaction.findAll(transactionQuery)

				return response.status(200).json({
					status: 'Successful',
					message: 'Transactions successfully retrieved',
					data: filteredTransactions,
				})
			}

			const transactions = await BusTicketing.Transaction.findAll(transactionQuery)

			return response.status(200).json({
				status: 'Successful',
				message: 'Transactions successfully retrieved',
				data: transactions,
			})
		} catch (error: any) {
			return response.status(400).json({
				status: 'Failed',
				message: error.message,
			})
		}
	},
}

export = BusTicketService
