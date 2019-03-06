import express = require('express')
import bodyParser = require('body-parser')
import { Request, Response } from 'express'
import axios from 'axios'
import _ from 'lodash'

import { _error } from './error'

import Greeter, { User } from './Greeter'

const log = require('ololog')
const Chance = require('chance')
const chance = new Chance()

// Color console log config
log.configure({ locate: false })

let crypto_arr: Array<object> = []
let user_agent: any

class App {
    constructor() {
        this.app = express()
        this._config()
        this._routes()
    }

    public app: express.Application

    private _config(): void {
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: false }))
        this.app.use((req: any, res: any, next: any) => {
            user_agent = req.get('User-Agent')
            next()
        })
    }

    private _market_name(sym: string) {
        return sym.replace('/', '_')
    }

    private _url(base: string, quote: string, limit: number) {
        let _limit = Math.floor(limit)
        return `https://min-api.cryptocompare.com/data/histominute?fsym=${base}&tsym=${quote}&limit=${_limit}&aggregate=1&e=hitbtc`
    }

    private _routes() {
        const router = express.Router()

        router.get('/', (req: Request, res: Response) => {
            this._get_data('/').then(response => {
                let candel_obj_model = {
                    time: 1539548160,
                    close: 6398.75,
                    high: 6399.07,
                    low: 6395,
                    open: 6398.17,
                    volumefrom: 2.94,
                    volumeto: 18810.2
                }

                let exchange_name = 'hitbtc'
                let market_name = 'BTC_USD'

                log.blue('crypto_arr', crypto_arr.length)
                log.blue('crypto_arr', crypto_arr[0])

                _.each(crypto_arr, (candle_obj: any) => {
					let _id = `${exchange_name}__${market_name}___${candle_obj.timestamp}`

					let update = {
						index: 'hitbtc_candles_btc_usd',
						type: 'hitbtc_market',
						id: _id,
						body: candle_obj
					}
                })

                res.status(200).send(crypto_arr)
            })
        })

        router.post('/', (req: Request, res: Response) => {
            log.lightYellow('post', '/')

            const data = req.body
            res.status(200).send(data)
        })

        this.app.use('/', router)
    }

    private _rest_client(market_name: string, url: string, market_info: object): Promise<string> {
        log.green('market_name', market_name)
        log.green('url', url)
        log.green('market_info', market_info)

        return new Promise<string>((resolve, reject) => {
            axios({
                url: url,
                method: 'get'
            })
                .then(res => {
                    let res_data = res.data

                    _.each(res_data.Data, obj => {
                        let timestamp = obj.time * 1000

                        let date = new Date(timestamp)

                        obj.volume = _.add(obj.volumeto, obj.volumeto)

                        crypto_arr.push({
                            timestamp: timestamp,
                            date: date,
                            close: obj.close,
                            high: obj.high,
                            low: obj.low,
                            open: obj.open,
                            volume: obj.volumefrom,
                            short: null,
                            long: null
                        })
                    })

                    resolve(res_data)
                })
                .catch(err => {
                    _error('_rest_client', err)
                })
        })
    }

    private _get_data = async (route: string) => {
        let _interval = '1m'

        let _test_markets_all = [
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

        let _test_markets = [
            {
                base: 'BTC',
                quote: 'USDT',
                symbol: 'BTC/USDT'
            }
        ]

		let _market_name = this._market_name(_test_markets[0].symbol)
		let _base = _test_markets[0].base
		let _quote = _test_markets[0].quote

		let _url = this._url(_base, _quote, 2)

        await this._rest_client(_market_name, _url, _test_markets[0])

        return new Promise<string>((resolve, reject) => {
            resolve(route)
        })
    }
}

export default new App().app
