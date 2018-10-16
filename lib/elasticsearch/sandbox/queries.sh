#!/usr/bin/env bash


#!/bin/sh
npm test


curl -X POST "localhost:9200/_reindex" -H 'Content-Type: application/json' -d'
{
  "source": {
    "index": "hitbtc_candles_1"
  },
  "dest": {
    "index": "hitbtc_candles"
  }
}
'


# RANGE QUERY

curl -X GET "localhost:9200/hitbtc_candles_1/_search" -H 'Content-Type: application/json' -d'
{
    "query": {
        "range" : {
            "close" : {
                "gte" : 6760,
                "lte" : 6712,
                "boost" : 2.0
            }
        }
    }
}
'


# Range Buckets -- Close
curl -X GET "localhost:9200/hitbtc_candles_1/_search" -H 'Content-Type: application/json' -d'

{
    "size": 0,
    "aggs" : {
        "close_high_low" : {
            "range" : {
                "field" : "close",
                "ranges" : [
                    { "from" : 6710, "to" : 6720 },
                    { "from" : 6721, "to" : 6740 },
                    { "from" : 6741, "to" : 6760 }
                ]
            }
        }
    }
}

'


# Keyed Range Buckets -- Close
curl -X GET "localhost:9200/hitbtc_candles_1/_search" -H 'Content-Type: application/json' -d'

{
    "size": 0,
    "aggs" : {
        "close_high_low" : {
            "range" : {
                "field" : "close",
                "keyed" : true,
                "ranges" : [
                    {  "key" : "high", "from" : 6741, "to" : 6760 },
                    {  "key" : "mid", "from" : 6721, "to" : 6740 },
                    {  "key" : "low", "from" : 6710, "to" : 6720 }
                ]
            }
        }
    }
}

'

# MIN MAX - Close
curl -X GET "localhost:9200/hitbtc_candles_1/_search" -H 'Content-Type: application/json' -d'

{
    "size": 0,
    "aggs" : {
        "min_close" : { "min" : { "field" : "close" } },
        "max_close" : { "max" : { "field" : "close" } }

    }
}

'

# MIN MAX - Close
# Filter - Timestamp

curl -X GET "localhost:9200/hitbtc_candles_1/_search" -H 'Content-Type: application/json' -d'

{
    "size": 0,
    "aggs" : {
        "min_close" : { "min" : { "field" : "close" } },
        "max_close" : { "max" : { "field" : "close" } }

    }
}

'

curl -X POST "localhost:9200/hitbtc_candles_1/_search" -H 'Content-Type: application/json' -d'

{
    "size": 1,
    "aggs": {
        "my_date_histo":{
            "date_histogram":{
                "field":"time",
                "interval":"1m"
            },
            "aggs":{
                "the_sum":{
                    "sum":{ "field": "close" }
                },
                "the_movavg":{
                    "moving_avg":{ "buckets_path": "the_sum" }
                }
            }
        }
    }
}

'


curl -X POST "localhost:9200/hitbtc_candles_1/_search" -H 'Content-Type: application/json' -d'


{
    "size": 0,
    "aggs": {
        "my_date_histo":{
            "date_histogram":{
                "field":"time",
                "interval":"5m"
            },
            "aggs":{
                "the_sum":{
                    "sum":{ "field": "close" }
                },
                "the_movavg":{
                    "moving_avg":{
                        "buckets_path": "the_sum",
                        "window" : 30,
                        "model" : "simple"
                    }
                }
            }
        }
    }
}


'



curl -X POST "localhost:9200/hitbtc_candles_1/_search" -H 'Content-Type: application/json' -d'


{
    "size": 0,
    "aggs": {
        "my_date_histo":{
            "date_histogram":{
                "field":"high",
                "interval":"5m"
            },
            "aggs":{
                "the_sum":{
                    "sum":{ "field": "high" }
                },
                "the_movavg": {
                    "moving_avg":{
                        "buckets_path": "the_sum",
                        "window" : 5,
                        "model" : "ewma",
                        "settings" : {
                            "alpha" : 0.5
                        }
                    }
                }
            }
        }
    }
}


'



curl -X POST "localhost:9200/hitbtc_candles_1/_search?size=0" -H 'Content-Type: application/json' -d'


{
    "aggs" : {
        "close_over_time" : {
            "date_histogram" : {
                "field" : "time",
                "interval" : "month"
            }
        }
    }
}


'



curl -X PUT "localhost:9200/hitbtc_candles_1/_doc/1?refresh" -H 'Content-Type: application/json' -d'
{
  "date": "2015-10-01T00:30:00Z"
}
'
curl -X PUT "localhost:9200/hitbtc_candles_1/_doc/2?refresh" -H 'Content-Type: application/json' -d'
{
  "date": "2015-10-01T01:30:00Z"
}
'
curl -X GET "localhost:9200/hitbtc_candles_1/_search?size=0" -H 'Content-Type: application/json' -d'

{
  "size" : 0,
  "aggs": {
    "candle_intervals": {
      "date_histogram": {
        "field":     "date",
        "interval":  "5m"
      }
    }
  }
}

'


curl -X PUT "localhost:9200/hitbtc_candles_1" -H 'Content-Type: application/json' -d'

{
  "mappings": {
    "_doc": {
      "properties": {
        "date": {
          "type":   "date",
          "format": "yyyy-MM-dd'T'HH:mm"
        }
      }
    }
  }
}

'



# GET MAPPINGS

curl -X GET "localhost:9200/hitbtc_candles_4a/_mapping"




# POST SCRIPT

curl -X POST "localhost:9200/_scripts/calculate-score" -H 'Content-Type: application/json' -d'
{
  "script": {
    "lang": "painless",
    "source": "Math.log(_score * 2) + params.my_modifier"
  }
}
'

curl -X GET "localhost:9200/my_index/_search" -H 'Content-Type: application/json' -d'
{
  "script_fields": {
    "my_doubled_field": {
      "script": {
        "lang":   "expression",
        "source": "doc[\u0027my_field\u0027] * multiplier",
        "params": {
          "multiplier": 2
        }
      }
    }
  }
}

'




curl - X PUT "localhost:9200/hitbtc_candles_4a/_mapping" - H 'Content-Type: application/json' - d '
"mappings": {
	"BTC_USD": {
		"properties": {
			"close": {
				"type": "float"
			},
			"date": {
				"type": "date"
			},
			"high": {
				"type": "float"
			},
			"low": {
				"type": "float"
			},
			"open": {
				"type": "float"
			},
			"time": {
				"type": "long"
			},
			"timestamp": {
				"type": "long"
			},
			"volumefrom": {
				"type": "float"
			},
			"volumeto": {
				"type": "float"
			}
		}
	}
	'



curl -X PUT "localhost:9200/twitter" -H 'Content-Type: application/json' -d'
{
  "mappings": {
    "tweet": {
      "properties": {
        "message": {
          "type": "text"
        }
      }
    }
  }
}
'


# ADD NEW FIELD w/MAPPINGS

curl -X GET "localhost:9200/hitbtc_candles_4a/_mapping"

curl -X PUT "localhost:9200/hitbtc_candles_4a/_mapping/volume" -H 'Content-Type: application/json' -d'

{
  "properties": {
    "volume": {
      "type": "float"
    }
  }
}

'


curl -X PUT "localhost:9200/hitbtc_candles_4a/_mapping/volume" -H 'Content-Type: application/json' -d'
{
  "properties": {
    "user_name": {
      "type": "text"
    }
  }
}
'





curl -X PUT "localhost:9200/twitter" -H 'Content-Type: application/json' -d'
{
  "mappings": {
    "tweet": {
      "properties": {
        "message": {
          "type": "text"
        }
      }
    }
  }
}
'
curl -X POST "localhost:9200/twitter/_mapping/user" -H 'Content-Type: application/json' -d'
{
  "properties": {
    "name": {
      "type": "text"
    }
  }
}
'
curl -X PUT "localhost:9200/hitbtc_candles_4a/_mapping/volume" -H 'Content-Type: application/json' -d'
{
  "properties": {
    "balls": {
      "type": "text"
    }
  }
}
'


curl -X PUT "localhost:9200/twitter" -H 'Content-Type: application/json' -d'
{}
'
curl -X PUT "localhost:9200/hitbtc_candles_4a/_mapping/BTC_USD" -H 'Content-Type: application/json' -d'
{
  "properties": {
    "volume": {
      "type": "float"
    }
  }
}
'


