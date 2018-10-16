#!/usr/bin/env bash

version=4

# Candle Interval

curl -X GET "localhost:9200/hitbtc_candles_${version}/_search" -H 'Content-Type: application/json' -d'

{
  "size": 0,
  "aggs": {
    "candle_intervals": {
      "date_histogram": {
        "field": "date",
        "interval": "15m"
      },
      "aggs": {
        "sum_close": {
          "sum": {
            "field": "close"
          }
        },
        "the_movavg": {
          "moving_avg": {
            "buckets_path": "sum_close",
            "window": 15,
            "model": "ewma",
            "settings": {
              "alpha": 0.5
            }
          }
        }
      }
    }
  }
}

'