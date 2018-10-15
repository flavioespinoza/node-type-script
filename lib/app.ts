import * as express from 'express'
import bodyParser = require('body-parser')
import {Request, Response} from 'express'

const _ = require('lodash')
const Chance = require('chance')
const chance = new Chance()

const Client = require('node-rest-client').Client
const log = require('ololog').configure({
    locate: false
})

const elasticsearch = require('elasticsearch')
const es = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
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
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({extended: false}))
        this.app.use(function (req, res, next) {
            user_agent = req.get('User-Agent')
            next()
        })
    }

    private routes(): void {

        const self = this
        const router = express.Router()

        router.get('/', function (req: Request, res: Response) {

            self.get_data('/').then(async (success) => {

                // log.red('crypto_arr', JSON.stringify(crypto_arr, null, 2))

                let raw_data = {
                    data: crypto_arr,
                    route: '/',
                    status: 'success'
                }

                let exchange_name = 'hitbtc'

                await es.create({
                    index: `${exchange_name}_candles_raw`,
                    type: 'raw_candles',
                    id: `${exchange_name}__raw_candles___${chance.guid()}`,
                    body: raw_data
                })

                res.status(200).send(raw_data)

            })

        })

        router.get('/balls', function (req: Request, res: Response) {

            self.get_data('balls').then((success) => {

                log.blue('crypto_arr', JSON.stringify(crypto_arr, null, 2))

                res.status(200).send({
                    data: Object.assign({balls: 'balls', arr: crypto_arr}),
                    route: 'balls',
                    status: 'success'
                })

            })

        })

        router.post('/', function (req: Request, res: Response) {

            log.lightYellow('post /')

            const data = req.body
            res.status(200).send(data)

        })

        this.app.use('/', router)

    }

    private rest_client(market_name: string, url: string, market_info: object): Promise<string> {

        const args = {
            headers: {
                'User-Agent': user_agent
            }
        }

        const client = new Client()

        let _exchange_name = 'hitbtc'

        return new Promise<string>((resolve, reject) => {

            client.get(url, args, (res_data, res) => {
                crypto_arr.push({
                    exchange_name: _exchange_name,
                    market_name: market_name,
                    market_info: market_info,
                    url_candles: url,
                    res_data: res_data,
                })
                resolve(res_data)
            })

        })

    }

    private async get_data(route: string): Promise<string> {
        
        const self = this

        let _interval = '1m'

        let _test_markets = [
            {
                base: 'CCL',
                quote: 'USD',
                symbol: 'CCL/USDT'
            },
            {
                base: 'CCL',
                quote: 'ETH',
                symbol: 'CCL/ETH'
            },
            {
                base: 'BTC',
                quote: 'USDT',
                symbol: 'BTC/USDT'
            },
            {
                base: 'ETH',
                quote: 'USDT',
                symbol: 'ETH/USDT'
            },
            {
                base: 'ETH',
                quote: 'BTC',
                symbol: 'ETH/BTC'
            },
            {
                base: 'ADA',
                quote: 'USDT',
                symbol: 'ADA/USDT'
            },
            {
                base: 'ADA',
                quote: 'BTC',
                symbol: 'ADA/BTC'
            },
            {
                base: 'ADA',
                quote: 'ETH',
                symbol: 'ADA/ETH'
            }
        ]

        let _market_name = function (sym) {
            return sym.replace('/', '_')
        }

        let _url = function (base, quote) {

            return `https://min-api.cryptocompare.com/data/histominute?fsym=${base}&tsym=${quote}&aggregate=1&e=hitbtc`
        }

        for (let i = 0; i < _test_markets.length; i++) {

            await this.rest_client(_market_name(_test_markets[i].symbol), _url(_test_markets[i].base, _test_markets[i].quote), _test_markets[i])

        }

        return new Promise<string>((resolve, reject) => {
            resolve(route)
        })

    }

}


export default new App().app