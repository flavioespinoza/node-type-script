#!/usr/bin/env bash

curl -X POST "localhost:9200/hitbtc_candles_btc_usd/_update" -H 'Content-Type: application/json' -d'

{
    "script" : {
        "source": "ctx._source.counter += params.count",
        "lang": "painless",
        "params" : {
            "count" : 4
        }
    },
    "upsert" : {
        "counter" : 1
    }
}


'
