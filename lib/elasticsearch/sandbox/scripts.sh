#!/usr/bin/env bash


curl -X POST "localhost:9200/test_mapping/_search?size=0" -H 'Content-Type: application/json' -d'
{
    "query" : {
        "match_all" : {}
    },
    "aggs": {
        "profit": {
            "scripted_metric": {
                "init_script" : "state.transactions = []",
                "map_script" : "state.transactions.add(params._fields[\u0027close\u0027])",
                "combine_script" : "double profit = 0; for (t in state.transactions) { profit += t } return profit",
                "reduce_script" : "double profit = 0; for (a in states) { profit += a } return profit"
            }
        }
    }
}
'
