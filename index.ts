import express, { Express, Request, Response } from 'express'
import BusTicketService from './Services/BusTickettingApiService'
import AuthService from './Services/AuthService'
import cors from 'cors'
import dotenv from 'dotenv'
import { auth } from './middleware/auth'

dotenv.config()

const app: Express = express()
app.use(express.json())

app.use(cors())

const port = process.env.PORT

app.get('/', async (_request: Request, response: Response) => {
	console.log('This is it')
	return response.json({
		status: 'Successful',
		message: 'Everything is ok with my health.',
		data: null,
	})
})

app.post('/register', AuthService.createUser)
app.post('/login', AuthService.login)
app.post('/ticket/create', auth, BusTicketService.createBusTicket)
app.post('/user/transfer-fund', auth, BusTicketService.creditAccount)
app.post('/ticket/buy', auth, BusTicketService.buyTicket)
app.get('/user/balance', auth, BusTicketService.getBalance)
app.get('/user/transactions', auth, BusTicketService.getTransactions)

app.listen(port, () => console.log(`⚡️[server]: Magic happens on port ${port}`))
