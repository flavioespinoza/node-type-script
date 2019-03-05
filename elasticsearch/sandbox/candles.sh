#!/usr/bin/env bash

version=4

# Candle Interval

curl -XGET "http://178.128.190.197:9200/_search" -H 'Content-Type: application/json' -d'

{
  "size": 10,
  "query": {
    "match_all": {}
  }
}

'


curl -XGET "localhost:9200/_search" -H 'Content-Type: application/json' -d'

{
  "size": 10,
  "query": {
    "match_all": {}
  }
}

'

