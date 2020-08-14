# node-typescript

Example of Node server with multiple rest async await calls.

## Prerequisites

Install typescript globally:

```bash
$ npm i -g typescript

or

sudo npm i -g typescript
```

Install ts-node globally:

```bash
npm i -g ts-node

or

sudo npm i -g ts-node
```

Install Node Packages:

```bash
yarn
```

Compile all typescript files to Javascript:

```bash
tcs

or

yarn run build
```

Run app

```bash
yarn run start
```

Navigate to <http://localhost:7000> in your favorite web browser


## Browser
The data shown is the latest ticker info for the past 3 minutes for `Bitcoin/US Dollar` on cryptocompare.com

```json
[
  {
    "exchange": "HitBTC",
    "market_info": {
      "base": "BTC",
      "quote": "USDT",
      "symbol": "BTC/USDT"
    },
    "timestamp": 1597433400000,
    "date": "2020-08-14T19:30:00.000Z",
    "close": 11811.63,
    "high": 11812.31,
    "low": 11807.37,
    "open": 11809.38,
    "volume": 15.14,
    "short": null,
    "long": null
  },
  {
    "exchange": "HitBTC",
    "market_info": {
      "base": "BTC",
      "quote": "USDT",
      "symbol": "BTC/USDT"
    },
    "timestamp": 1597433460000,
    "date": "2020-08-14T19:31:00.000Z",
    "close": 11812.1,
    "high": 11814.12,
    "low": 11810.61,
    "open": 11811.63,
    "volume": 0.1788,
    "short": null,
    "long": null
  },
  {
    "exchange": "HitBTC",
    "market_info": {
      "base": "BTC",
      "quote": "USDT",
      "symbol": "BTC/USDT"
    },
    "timestamp": 1597433520000,
    "date": "2020-08-14T19:32:00.000Z",
    "close": 11811.1,
    "high": 11812.1,
    "low": 11811.1,
    "open": 11812.1,
    "volume": 0,
    "short": null,
    "long": null
  }
]
```

## Development

> **IMPORTANT**: Only make changes to `lib/app.ts` or `lib/server.ts` files.

Make changes then stop server with `Ctrl + C`:

```bash
^C
```

Run build and restart to see your changes on <http://localhost:7000>:

```bash
yarn run restart
```
