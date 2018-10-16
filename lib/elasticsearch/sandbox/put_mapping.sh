#!/usr/bin/env bash

curl -X PUT "localhost:9200/test_mapping" -H 'Content-Type: application/json' -d'
{
  "mappings": {
    "BTC_USD": {
				"properties": {
					"close": {
						"type": "float",
						"store": true
					},
					"date": {
						"type": "date",
						"store": true
					},
					"high": {
						"type": "float",
						"store": true
					},
					"low": {
						"type": "float",
						"store": true
					},
					"open": {
						"type": "float",
						"store": true
					},
					"time": {
						"type": "long",
						"store": true
					},
					"timestamp": {
						"type": "long",
						"store": true
					},
					"volume": {
						"type": "float",
						"store": true
					},
					"volumefrom": {
						"type": "float",
						"store": true
					},
					"volumeto": {
						"type": "float",
						"store": true
					}
				}
			}
    }
  }
}
'
