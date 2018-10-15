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
const Client = require('node-rest-client').Client;
const log = require('ololog').configure({
    locate: false
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
        const __self = this;
        const router = express.Router();
        router.get('/', function (req, res) {
            __self.get_data('/').then((success) => {
                log.red('crypto_arr', JSON.stringify(crypto_arr, null, 2));
                res.status(200).send({
                    data: crypto_arr,
                    route: '/',
                    status: 'success'
                });
            });
        });
        router.get('/balls', function (req, res) {
            __self.get_data('balls').then((success) => {
                log.blue('crypto_arr', JSON.stringify(crypto_arr, null, 2));
                res.status(200).send({
                    data: Object.assign({ balls: 'balls', arr: crypto_arr }),
                    route: 'balls',
                    status: 'success'
                });
            });
        });
        router.post('/', function (req, res) {
            log.lightYellow('post /');
            const data = req.body;
            res.status(200).send(data);
        });
        this.app.use('/', router);
    }
    rest_client(market_name, url) {
        const args = {
            headers: {
                'User-Agent': user_agent
            }
        };
        console.log(url);
        const client = new Client();
        return new Promise((resolve, reject) => {
            client.get(url, args, (data, res) => {
                crypto_arr.push({
                    market: market_name,
                    ticker: data,
                });
                resolve(data);
            });
        });
    }
    get_data(route) {
        return __awaiter(this, void 0, void 0, function* () {
            crypto_arr = [];
            const self = this;
            let first = 'eth-usd';
            let second = 'btc-usd';
            let third = 'bch-usd';
            let _interval = '1m';
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
                    quote: 'USD',
                    symbol: 'BTC/USDT'
                },
                {
                    base: 'ETH',
                    quote: 'USD',
                    symbol: 'ETH/USDT'
                },
                {
                    base: 'ETH',
                    quote: 'BTC',
                    symbol: 'ETH/BTC'
                },
                {
                    base: 'ADA',
                    quote: 'USD',
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
            let _market_name = function (sym) {
                return sym.replace('/', '_');
            };
            let _url = function (base, quote) {
                return `https://min-api.cryptocompare.com/data/histominute?fsym=${base}&tsym=${quote}&aggregate=1&e=hitbtc`;
            };
            function asyncForEach(array, callback) {
                return __awaiter(this, void 0, void 0, function* () {
                    for (let index = 0; index < array.length; index++) {
                        yield callback(array[index], index, array);
                    }
                });
            }
            function waitFor(markets) {
                return self.rest_client(_market_name(markets.symbol), _url(markets.base, markets.quote));
            }
            const start = (all_markets) => __awaiter(this, void 0, void 0, function* () {
                yield asyncForEach(all_markets, (market) => __awaiter(this, void 0, void 0, function* () {
                    log.red('market', market);
                    let stuff = yield waitFor(market);
                    // console.log('stuff', stuff)
                }));
                console.log('Done');
            });
            start(_test_markets);
            return new Promise((resolve, reject) => {
                resolve(route);
            });
        });
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map