"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const log = require('ololog').configure({
    locate: false
});
const _ = require('lodash');
const Chance = require('chance');
const chance = new Chance();
const Client = require('node-rest-client').Client;
const elasticsearch = require('elasticsearch');
const es = new elasticsearch.Client({
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
});
let crypto_arr = [];
let user_agent = null;
class App {
    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }
    config() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(function (req, res, next) {
            user_agent = req.get('User-Agent');
            next();
        });
    }
    routes() {
        const self = this;
        const router = express.Router();
        router.get('/', function (req, res) {
            self.get_data('/').then((response) => {
                // log.red('crypto_arr', JSON.stringify(crypto_arr, null, 2))
                let candel_obj_model = {
                    "time": 1539548160,
                    "close": 6398.75,
                    "high": 6399.07,
                    "low": 6395,
                    "open": 6398.17,
                    "volumefrom": 2.94,
                    "volumeto": 18810.2
                };
                let exchange_name = 'hitbtc';
                let market_name = 'BTC_USD';
                log.blue('crypto_arr', crypto_arr);
                es.create({
                    index: 'hitbtc_candles_btc_usd',
                    type: 'BTC_USD',
                    id: 1,
                    body: {
                        "time": 1539548160,
                        "close": 6398.75,
                        "high": 6399.07,
                        "low": 6395,
                        "open": 6398.17,
                        "volumefrom": 2.94,
                        "volumeto": 18810.2
                    }
                });
                _.each(crypto_arr, function (candle_obj) {
                    (function () {
                        return __awaiter(this, void 0, void 0, function* () {
                            let _id = `${exchange_name}__${market_name}___${candle_obj.timestamp}`;
                            yield es.create({
                                index: 'hitbtc_candles_btc_usd',
                                type: 'BTC_USD',
                                id: _id,
                                body: candle_obj
                            });
                            // let exists = await es.exists({
                            //     index: 'hitbtc_candles_btc_usd',
                            //     type: 'BTC_USD',
                            //     id: _id
                            // })
                            //
                            // if (!exists) {
                            //     await es.create({
                            //         index: 'hitbtc_candles_btc_usd',
                            //         type: 'BTC_USD',
                            //         id: _id,
                            //         body: candle_obj
                            //     });
                            // }
                        });
                    })();
                });
                res.status(200).send(crypto_arr);
            });
        });
        router.post('/', function (req, res) {
            log.lightYellow('post', '/');
            const data = req.body;
            res.status(200).send(data);
        });
        this.app.use('/', router);
    }
    rest_client(market_name, url, market_info) {
        const args = {
            headers: {
                'User-Agent': user_agent
            }
        };
        const client = new Client();
        let _exchange_name = 'hitbtc';
        return new Promise((resolve, reject) => {
            client.get(url, args, (res_data, res) => {
                let fuck = res_data.Data;
                _.each(res_data.Data, function (candle_obj) {
                    let timestamp = candle_obj.time * 1000;
                    let date = new Date(timestamp);
                    candle_obj.timestamp = timestamp;
                    candle_obj.date = date;
                    crypto_arr.push(candle_obj);
                });
                resolve(res_data);
            });
        });
    }
    get_data(route) {
        return __awaiter(this, void 0, void 0, function* () {
            const self = this;
            let _interval = '1m';
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
            ];
            let _test_markets = [
                {
                    base: 'BTC',
                    quote: 'USDT',
                    symbol: 'BTC/USDT'
                },
            ];
            let _market_name = function (sym) {
                return sym.replace('/', '_');
            };
            let _url = function (base, quote) {
                return `https://min-api.cryptocompare.com/data/histominute?fsym=${base}&tsym=${quote}&aggregate=1&e=hitbtc`;
            };
            yield this.rest_client(_market_name(_test_markets[0].symbol), _url(_test_markets[0].base, _test_markets[0].quote), _test_markets[0]);
            return new Promise((resolve, reject) => {
                resolve(route);
            });
        });
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map