import { Sequelize } from 'sequelize'
import { DATABASE_HOST, DATABASE_NAME, DATABASE_PASSWORD, DATABASE_USERNAME } from '../config'
import { UserModel, WalletModel, TicketModel, TransactionModel } from './Models'
export const BusTicketing: any = {}

const initialize = async () => {
	const sequelize = new Sequelize(DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, {
		host: DATABASE_HOST,
		dialect: 'mysql',
		port: 3306,
		logging: false,
	})

	BusTicketing.sequelize = sequelize
	BusTicketing.User = UserModel(sequelize)
	BusTicketing.Wallet = WalletModel(sequelize)
	BusTicketing.Transaction = TransactionModel(sequelize)
	BusTicketing.Ticket = TicketModel(sequelize)

	await sequelize.sync()
}

initialize()
