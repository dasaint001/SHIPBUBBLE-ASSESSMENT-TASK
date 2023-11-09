import { BusTicketing } from '../Database/BusTicketing'
import { Request, Response } from 'express'
import moment from 'moment'
import { Validator } from 'node-input-validator'
import * as bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
const STATUS_PENDING = 'PENDING'
const timeStamp = moment().format(TIME_FORMAT).toString()

const AuthService = {
	createUser: async (request: Request, response: Response) => {
		try {
			const validator = new Validator(request.body, {
				userName: 'required',
				phoneNumber: 'required|numeric',
				password: 'required',
			})

			const salt = 10
			const hashedPassword = await bcrypt.hash(request.body.password, salt)

			const matched = await validator.check()
			if (!matched) {
				return response.status(422).json({
					status: 'Failed',
					message: 'Validation Failed',
					data: validator.errors,
				})
			}

			const isPhoneExist = await BusTicketing.User.findOne({
				where: {
					phoneNumber: request.body.phoneNumber,
				},
			})

			if (isPhoneExist) {
				return response.status(400).json({
					status: 'Failed',
					message: 'Phone number already in use',
				})
			}

			const user = await BusTicketing.User.create({
				userName: request.body.userName,
				phoneNumber: request.body.phoneNumber,
				password: hashedPassword,
				CreatedAt: timeStamp,
				UpdatedAt: timeStamp,
			})

			const wallet = await BusTicketing.Wallet.create({
				UserID: user.ID,
				Balance: '1000',
				CreatedAt: timeStamp,
				UpdatedAt: timeStamp,
			})

			return response.status(201).json({
				status: 'Successful',
				message: 'User created Successfully',
				data: { user, wallet },
			})
		} catch (error: any) {
			return response.status(400).json({
				status: 'Failed',
				message: error.message,
				data: null,
			})
		}
	},

	login: async (request: Request, response: Response) => {
		try {
			const validator = new Validator(request.body, {
				phoneNumber: 'required',
				password: 'required',
			})

			const matched = await validator.check()

			if (!matched) {
				return response.status(422).json({
					status: 'Failed',
					message: 'Validation Failed',
					data: validator.errors,
				})
			}

			const salt = 10

			const user = request.body

			const { phoneNumber, password } = user

			const isUserExist = await BusTicketing.User.findOne({ where: { phoneNumber: phoneNumber } })

			if (!isUserExist) {
				return response.status(404).json({
					status: 'Failed',
					message: 'User not found',
				})
			}

			const isPasswordMatched = await bcrypt.compare(password, isUserExist.password)

			if (!isPasswordMatched) {
				return response.status(400).json({
					status: 'Failed',
					message: 'Wrong password',
				})
			}

			const token = jwt.sign({ ID: isUserExist?.ID, phoneNumber: isUserExist?.phoneNumber }, 'YOUR_SECRET', {
				expiresIn: '1d',
			})

			return response.status(201).json({
				status: 'Successful',
				message: 'Login successfully',
				data: token,
			})
		} catch (error: any) {
			return response.status(400).json({
				status: 'Failed',
				message: error.message,
			})
		}
	},
}

export = AuthService
