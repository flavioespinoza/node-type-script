import * as express from 'express'
import bodyParser = require('body-parser')
import { Request, Response } from 'express'

import * as _ from 'lodash'

const Client = require('node-rest-client').Client
const log = require('ololog').configure({
    locate: false
})

let crypto_arr: Array<object> = []
let user_agent = null

class App {

    constructor() {
        this.app = express()
        this.config()
        this.routes()
    }

    public app: express.Application

    private config(): void {
        this.append('App start', [])
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({extended: false}))
        this.app.use(function(req, res, next) {
            user_agent = req.get('User-Agent')
            next()
        })
    }

    private routes(): void {

        const __self = this
        const router = express.Router()

        router.get('/', function (req: Request, res: Response) {

            __self.get_data('/').then((success) => {

                log.red('crypto_arr', crypto_arr)

                res.status(200).send({
                    data: crypto_arr,
                    status: '/',
                })

            })

        })

        router.get('/all', function (req: Request, res: Response) {

            __self.get_data('all').then((success) => {

                log.blue('crypto_arr', crypto_arr)

                res.status(200).send({
                    data: crypto_arr,
                    status: 'all',
                })
            })

        })

        router.post('/', function (req: Request, res: Response) {

            const data = req.body
            res.status(200).send(data)

        })

        this.app.use('/', router)

    }

    private append(content: string, arr: Array<object>): void {

    }

    private rest_client(market_name: string): Promise<string> {

        const args = {
            headers: {
                'User-Agent': user_agent
            }
        }
        const url = 'https://api.gdax.com/products/' + market_name + '/ticker'
        const client = new Client()

        return new Promise<string>((resolve, reject) => {
            client.get(url, args, (data, res) => {
                crypto_arr.push({
                    market: market_name,
                    ticker: data,
                })
                resolve(data)
            })
        })

    }

    private async get_data(route: string): Promise<string> {

        crypto_arr = []

        let first: string = 'btc-usd'
        let second: string = 'eth-usd'
        let third: string = 'bch-usd'

        log.cyan('First ' + first)
        await this.rest_client(first)

        log.yellow('Second ' + second)
        await this.rest_client(second)

        log.lightRed('Third ', third)
        await this.rest_client(third)

        return new Promise<string>((resolve, reject) => {
            resolve(route)
        })

    }

}

export default new App().app