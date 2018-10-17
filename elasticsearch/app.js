'use strict'
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
	return new (P || (P = Promise))(function (resolve, reject) {
		function fulfilled (value) { try { step(generator.next(value)) } catch (e) { reject(e) } }

		function rejected (value) { try { step(generator['throw'](value)) } catch (e) { reject(e) } }

		function step (result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value) }).then(fulfilled, rejected) }

		step((generator = generator.apply(thisArg, _arguments || [])).next())
	})
}
Object.defineProperty(exports, '__esModule', {value: true})
const express = require('express')
const bodyParser = require('body-parser')
const log = require('ololog').configure({
	locate: false
})
const _ = require('lodash')
const Chance = require('chance')
const chance = new Chance()
const Client = require('node-rest-client').Client
const client = new Client()
const elasticsearch = require('elasticsearch')
const es = new elasticsearch.Client({
	host: 'localhost:9200',
	log: 'trace'
})
let crypto_arr = []
let user_agent = null
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

class App {
	constructor () {
		this.app = express()
		this.config()
		this.routes()
	}

	config () {
		this.app.use(bodyParser.json())
		this.app.use(bodyParser.urlencoded({extended: false}))
		this.app.use(function (req, res, next) {
			user_agent = req.get('User-Agent')
			next()
		})
	}

	routes () {

		const self = this
		const router = express.Router()

		router.get('/', function (req, res) {

			self.get_data('/').then(function(response) {

				let _exchange_name = 'hitbtc'
				let _market_name   = 'BTC_USD'

				_.each(crypto_arr, async function (obj) {

					let _id = `${_exchange_name}__${_market_name}___${obj.timestamp}`
					let _index = `${_exchange_name}_candles_${_.toLower(_market_name)}`

					let exists = await es.exists({
						index: _index,
						type: _market_name,
						id: _id
					})

					if (!exists) {
						await es.create({
							index: _index,
							type: _market_name,
							id: _id,
							body: obj
						})
					}

				})

				res.status(200).send(crypto_arr)

			})

		})

		router.post('/', function (req, res) {
			const data = req.body
			res.status(200).send(data)
		})

		this.app.use('/', router)

	}

	rest_client (market_name, url) {

		let _args = { headers: { 'User-Agent': user_agent } }

		let _exchange_name = 'hitbtc'

		return new Promise(function (resolve, reject) {
			client.get(url, _args, (res_data, res) => {
				let fuck = res_data.Data
				_.each(res_data.Data, function (candle_obj) {
					let timestamp = candle_obj.time * 1000
					let date = new Date(timestamp)
					candle_obj.timestamp = timestamp
					candle_obj.date = date
					crypto_arr.push(candle_obj)
				})
				resolve(res_data)
			})
		})
	}

	get_data (route) {
		return new Promise(async function (resolve) {

			const self = this

			let _markets = [
				{
					base: 'BTC',
					quote: 'USDT',
					symbol: 'BTC/USDT'
				}
			]

			let _interval = 1
			let _exchange_name = 'hitbtc'

			const _market_name = function (sym) {
				return sym.replace('/', '_')
			}
			const _url = function (base, quote, interval, exchange_name) {
				return `https://min-api.cryptocompare.com/data/histominute?fsym=${base}&tsym=${quote}&aggregate=${interval}&e=${exchange_name}`
			}

			let __url = _url(_markets[0].base, _markets[0].quote, _interval, _exchange_name)

			self.rest_client(__url)

			resolve(route)

		})
	}
}

exports.default = new App().app