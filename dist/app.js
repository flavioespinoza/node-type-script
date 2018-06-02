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
        this.append('App start', []);
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
                log.red('crypto_arr', crypto_arr);
                res.status(200).send({
                    data: crypto_arr,
                    route: '/',
                    status: 'success'
                });
            });
        });
        router.post('/', function (req, res) {
            const data = req.body;
            res.status(200).send(data);
        });
        this.app.use('/', router);
    }
    append(content, arr) {
    }
    rest_client(market_name) {
        const args = {
            headers: {
                'User-Agent': user_agent
            }
        };
        const url = 'https://api.gdax.com/products/' + market_name + '/ticker';
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
            let first = 'eth-usd';
            let second = 'btc-usd';
            let third = 'bch-usd';
            log.cyan('First ' + first);
            yield this.rest_client(first);
            log.yellow('Second ' + second);
            yield this.rest_client(second);
            log.lightRed('Third ', third);
            yield this.rest_client(third);
            return new Promise((resolve, reject) => {
                resolve(route);
            });
        });
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map