import { DataTypes } from 'sequelize'

export const UserModel = (sequelize: any) => {
	const attributes = {
		ID: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		userName: { type: DataTypes.STRING, allowNull: true },
		phoneNumber: { type: DataTypes.STRING, allowNull: true },
		password: { type: DataTypes.STRING, allowNull: true },
		CreatedAt: { type: DataTypes.STRING, allowNull: true },
		UpdatedAt: { type: DataTypes.STRING, allowNull: true },
	}

	return sequelize.define('User', attributes, {
		timestamps: false,
	})
}

export const WalletModel = (sequelize: any) => {
	const attributes = {
		ID: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		UserID: { type: DataTypes.BIGINT, allowNull: true },
		Balance: { type: DataTypes.STRING, allowNull: true },
		CreatedAt: { type: DataTypes.STRING, allowNull: true },
		UpdatedAt: { type: DataTypes.STRING, allowNull: true },
	}

	return sequelize.define('Wallet', attributes, {
		timestamps: false,
	})
}

export const TicketModel = (sequelize: any) => {
	const attributes = {
		ID: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		Name: { type: DataTypes.STRING, allowNull: true },
		UserID: { type: DataTypes.BIGINT, allowNull: true },
		TicketID: { type: DataTypes.STRING, allowNull: true },
		Price: { type: DataTypes.STRING, allowNull: true },
		CreatedAt: { type: DataTypes.STRING, allowNull: true },
		UpdatedAt: { type: DataTypes.STRING, allowNull: true },
	}

	return sequelize.define('Ticket', attributes, {
		timestamps: false,
	})
}

export const TransactionModel = (sequelize: any) => {
	const attributes = {
		ID: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		Reference: { type: DataTypes.STRING, allowNull: true },
		Quantity: { type: DataTypes.STRING, allowNull: true },
		UserID: { type: DataTypes.STRING, allowNull: true },
		Type: { type: DataTypes.STRING, allowNull: true },
		Status: { type: DataTypes.STRING, allowNull: true },
		Amount: { type: DataTypes.STRING, allowNull: true },
		CreatedAt: { type: DataTypes.STRING, allowNull: true },
		UpdatedAt: { type: DataTypes.STRING, allowNull: true },
	}

	return sequelize.define('Transaction', attributes, {
		timestamps: false,
	})
}


