#!/usr/bin/env bash

curl -X POST "localhost:9200/_reindex" -H 'Content-Type: application/json' -d'

{
  "source": {
    "index": "hitbtc_candles_btc_usd_back"
  },
  "dest": {
    "index": "hitbtc_candles_btc_usd"
  }
}

'


