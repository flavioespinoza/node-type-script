"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const axios_1 = __importDefault(require("axios"));
const lodash_1 = __importDefault(require("lodash"));
const error_1 = require("./error");
const log = require('ololog').configure({ locate: false });
let crypto_arr = [];
let user_agent;
class App {
    constructor() {
        this._get_data = (route) => __awaiter(this, void 0, void 0, function* () {
            let _test_markets = [
                {
                    base: 'BTC',
                    quote: 'USDT',
                    symbol: 'BTC/USDT'
                }
            ];
            let _market_name = this._market_name(_test_markets[0].symbol);
            let _base = _test_markets[0].base;
            let _quote = _test_markets[0].quote;
            let _url = this._url(_base, _quote, 2);
            yield this._rest_client(_market_name, _url, _test_markets[0]);
            return new Promise((resolve, reject) => {
                resolve(route);
            });
        });
        this.app = express();
        this._config();
        this._routes();
    }
    _config() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use((req, res, next) => {
            user_agent = req.get('User-Agent');
            next();
        });
    }
    _market_name(sym) {
        return sym.replace('/', '_');
    }
    _url(base, quote, limit) {
        let _limit = Math.floor(limit);
        return `https://min-api.cryptocompare.com/data/histominute?fsym=${base}&tsym=${quote}&limit=${_limit}&aggregate=1&e=hitbtc`;
    }
    _routes() {
        const router = express.Router();
        router.get('/', (req, res) => {
            this._get_data('/').then(response => {
                let candle_obj_model = {
                    time: 1539548160,
                    close: 6398.75,
                    high: 6399.07,
                    low: 6395,
                    open: 6398.17,
                    volumefrom: 2.94,
                    volumeto: 18810.2
                };
                let exchange_name = 'hitbtc';
                let market_name = 'BTC_USD';
                log.blue('candle_obj_model', candle_obj_model);
                log.blue('crypto_arr', crypto_arr.length);
                log.blue('crypto_arr', crypto_arr[0]);
                lodash_1.default.each(crypto_arr, (candle_obj) => {
                    let _id = `${exchange_name}__${market_name}___${candle_obj.timestamp}`;
                    let update = {
                        index: 'hitbtc_candles_btc_usd',
                        type: 'hitbtc_market',
                        id: _id,
                        body: candle_obj
                    };
                    log.blue('update', update);
                });
                res.status(200).send(crypto_arr);
                crypto_arr = [];
            });
        });
        router.post('/', (req, res) => {
            log.lightYellow('post', '/');
            const data = req.body;
            res.status(200).send(data);
        });
        this.app.use('/', router);
    }
    _rest_client(symbol, url, market_info) {
        log.green('symbol', symbol);
        log.green('url', url);
        log.green('market_info', market_info);
        return new Promise((resolve, reject) => {
            axios_1.default({
                url: url,
                method: 'get'
            })
                .then(res => {
                let res_data = res.data;
                lodash_1.default.each(res_data.Data, obj => {
                    log.red(res_data.Data);
                    let timestamp = obj.time * 1000;
                    let date = new Date(timestamp);
                    obj.volume = lodash_1.default.add(obj.volumeto, obj.volumeto);
                    crypto_arr.push({
                        exchange: 'HitBTC',
                        market_info: market_info,
                        timestamp: timestamp,
                        date: date,
                        close: obj.close,
                        high: obj.high,
                        low: obj.low,
                        open: obj.open,
                        volume: obj.volumefrom,
                        short: null,
                        long: null
                    });
                });
                resolve(res_data);
            })
                .catch(err => {
                error_1._error('_rest_client', err);
            });
        });
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map