#!/usr/bin/env bash

curl -X POST "localhost:9200/_reindex" -H 'Content-Type: application/json' -d'
{
  "source": {
    "index": "test_mapping"
  },
  "dest": {
    "index": "hitbtc_candles_btc_usd"
  }
}
'
