import * as express from 'express'
import bodyParser = require('body-parser')
import { Request, Response } from 'express'
import { _error } from './error'
import { Chance } from 'chance'
import log from 'ololog'
import _ from 'lodash'

import Greeter, { User } from './Greeter'

const chance = new Chance ()

// Color console log config
log.configure ({ locate: false })

const Client = require ('node-rest-client').Client

const elasticsearch = require ('elasticsearch')
const es = new elasticsearch.Client ({
	// host: 'localhost:9200',
	// host: 'http://178.128.190.197:9200',
	hosts: [{
		protocol: 'http',
		host: '178.128.190.197',
		port: 9200,
		country: 'US',
		weight: 10
	}],
	log: 'trace'
})

let crypto_arr: Array<object> = []
let user_agent = null


let invalid_email = new User('flavioespinoza', 'flavio.espinoza_gmail.com')
let valid_email = new User('flavioespinoza', 'flavio.espinoza@gmail.com')

log.lightYellow(JSON.stringify(invalid_email._info(), null, 2))

log.blue(JSON.stringify(valid_email._info(), null, 2))


class App {

	constructor () {
		this.app = express ()
		this.config ()
		this.routes ()
	}

	public app: express.Application

	private config (): void {
		this.app.use (bodyParser.json ())
		this.app.use (bodyParser.urlencoded ({extended: false}))
		this.app.use (function (req, res, next) {
			user_agent = req.get ('User-Agent')
			next ()
		})
	}

	private routes (): void {

		const self = this
		const router = express.Router ()

		router.get ('/', function (req: Request, res: Response) {

			self.get_data ('/').then ((response) => {

				// log.red('crypto_arr', JSON.stringify(crypto_arr, null, 2))

				let candel_obj_model = {
					'time': 1539548160,
					'close': 6398.75,
					'high': 6399.07,
					'low': 6395,
					'open': 6398.17,
					'volumefrom': 2.94,
					'volumeto': 18810.2
				}

				let exchange_name = 'hitbtc'
				let market_name = 'BTC_USD'

				log.blue ('crypto_arr', crypto_arr)

				_.each (crypto_arr, function (candle_obj) {

					(async function () {

						let _id = `${exchange_name}__${market_name}___${candle_obj.timestamp}`

						let exists = await es.exists ({
							index: 'hitbtc_candles_btc_usd',
							type: 'BTC_USD',
							id: _id
						})

						if (!exists) {
							await es.create ({
								index: 'hitbtc_candles_btc_usd',
								type: 'BTC_USD',
								id: _id,
								body: candle_obj
							})
						}

					}) ()

				})

				res.status (200).send (crypto_arr)

			})

		})


		router.post ('/', function (req: Request, res: Response) {

			log.lightYellow ('post', '/')

			const data = req.body
			res.status (200).send (data)

		})

		this.app.use ('/', router)

	}

	private rest_client (market_name: string, url: string, market_info: object): Promise<string> {

		const args = {
			headers: {
				'User-Agent': user_agent
			}
		}

		const client = new Client ()

		let _exchange_name = 'hitbtc'

		return new Promise<string> ((resolve, reject) => {

			client.get (url, args, (res_data, res) => {

				let fuck = res_data.Data

				_.each (res_data.Data, function (obj) {
					let timestamp = obj.time * 1000
					let date = new Date (timestamp)

					obj.volume = _.add (obj.volumeto, obj.volumeto)

					crypto_arr.push ({
						'timestamp': timestamp,
						'date': date,
						'close': obj.close,
						'high': obj.high,
						'low': obj.low,
						'open': obj.open,
						'volume': obj.volumefrom,
						short: null,
						long: null
					})
				})

				resolve (res_data)
			})

		})

	}

	private async get_data (route: string): Promise<string> {

		const self = this

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

		let _market_name = function (sym) {
			return sym.replace ('/', '_')
		}

		let _url = function (base, quote) {

			return `https://min-api.cryptocompare.com/data/histominute?fsym=${base}&tsym=${quote}&aggregate=1&e=hitbtc`
		}

		await this.rest_client (_market_name (_test_markets[0].symbol), _url (_test_markets[0].base, _test_markets[0].quote), _test_markets[0])


		return new Promise<string> ((resolve, reject) => {
			resolve (route)
		})

	}

}

export default new App ().app