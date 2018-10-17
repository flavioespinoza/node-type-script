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


curl -X GET "localhost:9200/hitbtc_candles_4/_search" -H 'Content-Type: application/json' -d'

{
  "size": 0,
  "aggs": {
    "duplicateCount": {
      "terms": {
        "script": "doc['timestamp'].values + doc['open'].values+doc['close'].values",
        "min_doc_count": 2
      },
      "aggs": {},
      "duplicateDocuments": {
        "top_hits": {}
      }
    }
  }
}

'


curl -X GET "localhost:9200/hitbtc_candles_4/_search" -H 'Content-Type: application/json' -d'

}
  "size": 0,
  "aggs": {
    "duplicateCount": {"terms": {
      "script": "doc['timestamp'].values + doc['open'].values+doc['close'].values",
      "min_doc_count": 2
    },
    "aggs": {}
      "duplicateDocuments": {
        "top_hits": {}
      }
    }
  }
}

'

