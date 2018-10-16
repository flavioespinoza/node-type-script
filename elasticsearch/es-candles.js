const log = require('ololog').configure({locate: false})
const _ = require('lodash')
const Chance = require('chance')
const chance = new Chance()

const self = this

let _dev = true
let _source_model = {

	'time': 1539558720,

	'close': 6361.69,
	'high': 6362.19,
	'low': 6361.37,
	'open': 6361.37,

	'volumefrom': 28.25,
	'volumeto': 179718.33,

	'timestamp': 1539558720000,
	'date': '2018-10-14T23:12:00.000Z'

	// Source candle data model from https://min-api.cryptocompare.com */
}

// Helper Functions */
function error (method, err, socket) {
	log.lightYellow(`${method}__ERROR `, err.message)
	if (socket) {
		socket.emit(`${method}__ERROR `, err.message)
	}
}

// Candle Query & Aggregation Methods */
module.exports.candles_moving_avg = async function (interval, smoothing_window, ma_model, alpha, query) {
	
	try {
		const _size = 0

		const _interval = function () {
			if (interval) {
				return `${interval}m`
			} else {
				return '1m'
			}
		}

		const _query = function () {
			if (query) {
				return query
			} else {
				return {
					match_all: {}
				}
			}
		}

		const _smoothing = function () {
			if (interval && smoothing_window) {
				return smoothing_window
			}
			else if (interval && !smoothing_window) {
				return interval
			}
			else {
				return 1
			}
		}

		const _ma_model = function () {
			if (ma_model) {
				return ma_model
			} else {
				return 'ewma'
			}
		}

		const _alpha = function () {
			if (alpha) {
				return alpha
			} else {
				return 0.5 // min: 0 - max: 1
			}
		}

		let body = {
			size: _size,
			query: _query(),
			aggs: {

				// INTERVAL */
				'the_interval': {
					date_histogram: {
						field: 'date',
						interval: _interval()
					},

					// CANDLES */
					aggs: {

						// OPEN */
						'the_sum_open': {
							sum: {
								field: 'open'
							}
						},
						'the_movavg_of_the_sum_open': {
							moving_avg: {
								buckets_path: 'the_sum_open',
								window: _smoothing(),
								model: _ma_model(),
								settings: {
									alpha: _alpha()
								}
							}
						},

						// HIGH */
						'the_sum_high': {
							sum: {
								field: 'high'
							}
						},
						'the_movavg_of_the_sum_high': {
							moving_avg: {
								buckets_path: 'the_sum_high',
								window: _smoothing(),
								model: _ma_model(),
								settings: {
									alpha: _alpha()
								}
							}
						},

						// LOW */
						'the_sum_low': {
							sum: {
								field: 'low'
							}
						},
						'the_movavg_of_the_sum_low': {
							moving_avg: {
								buckets_path: 'the_sum_low',
								window: _smoothing(),
								model: _ma_model(),
								settings: {
									alpha: _alpha()
								}
							}
						},

						// CLOSE */
						'the_sum_close': {
							sum: {
								field: 'close'
							}
						},
						'the_movavg_of_the_sum_close': {
							moving_avg: {
								buckets_path: 'the_sum_close',
								window: _smoothing(),
								model: _ma_model(),
								settings: {
									alpha: _alpha()
								}
							}
						},

						'the_sum_volumefrom': {
							sum: {
								field: 'volumefrom'
							}
						},
						'the_movavg_of_the_sum_volumefrom': {
							moving_avg: {
								buckets_path: 'the_sum_volumefrom',
								window: _smoothing(),
								model: _ma_model(),
								settings: {
									alpha: _alpha()
								}
							}
						},

						'the_sum_volumeto': {
							sum: {
								field: 'volumeto'
							}
						},
						'the_movavg_of_the_sum_volumeto': {
							moving_avg: {
								buckets_path: 'the_sum_volumeto',
								window: _smoothing(),
								model: _ma_model(),
								settings: {
									alpha: _alpha()
								}
							}
						}
					}
				}
			}
		}

		return JSON.stringify(body)
	} catch (err) {
	  error('candles_moving_avg', err)
	}

}

module.exports.candles_stats = async function (interval, query) {

	try {
		const _size = 0

		const _interval = function () {
			if (interval) {
				return `${interval}m`
			} else {
				return '1m'
			}
		}

		const _query = function () {
			if (query) {
				return query
			} else {
				return {
					match_all: {}
				}
			}
		}

		let body = {
			size: _size,
			query: _query(),
			aggs: {

				// INTERVAL */
				'the_interval': {
					date_histogram: {
						field: 'date',
						interval: _interval()
					},

					aggs: {

						// OPEN */
						'the_stats_open': {
							stats: {
								field: 'open'
							}
						},

						// HIGH */
						'the_stats_high': {
							stats: {
								field: 'high'
							}
						},

						// LOW */
						'the_stats_low': {
							stats: {
								field: 'low'
							}
						},

						// CLOSE */
						'the_stats_close': {
							stats: {
								field: 'close'
							}
						},

						// VOLUME_FROM */
						'the_stats_volumefrom': {
							stats: {
								field: 'volumefrom'
							}
						},

						// VOLUME_TO */
						'the_stats_volumeto': {
							stats: {
								field: 'volumeto'
							}
						}

					}
				}
			}
		}

		return JSON.stringify(body)
	} catch (err) {
	  error('candles_stats', err)
	}

}

module.exports.candles_OHLCV = async function (interval, query) {

	try {
		const _size = 0

		const _interval = function () {
			if (interval) {
				return `${interval}m`
			} else {
				return '1m'
			}
		}

		const _query = function () {
			if (query) {
				return query
			} else {
				return {
					match_all: {}
				}
			}
		}

		let body = {

			size: _size,
			query: _query(),

			// INTERVAL */
			aggs: {
				'the_interval': {
					date_histogram: {
						field: 'date',
						interval: _interval()
					},

					// CANDLES */
					aggs: {

						// OPEN */
						'the_open': {
							top_hits: {
								sort: [ { 'date': { order: 'asc' }} ],
								_source: {
									includes: [
										'date',
										'timestamp',
										'open' //***
									]
								},
								size: 1 // Returns First 1m candle in group with length of (interval)
							}
						},

						// CLOSE */
						'the_close': {
							top_hits: {
								sort: [
									{
										'date': {
											order: 'desc'
										}
									}
								],
								_source: {
									includes: [
										'date',
										'timestamp',
										'close' //***
									]
								},
								size: 1 // Returns Last 1m candle in group with length of (interval)
							}
						},

						// HIGH */
						'the_high': {
							max: {
								field: 'high'
							}
						},

						// LOW */
						'the_low': {
							max: {
								field: 'low'
							}
						},

						// VOLUME_FROM */
						'the_volumefrom': {
							sum: {
								field: 'volumefrom'
							}
						},

						// VOLUME_TO */
						'the_volumeto': {
							sum: {
								field: 'volumeto'
							}
						},

					}
				}
			}
		}

		return JSON.stringify(body)
	} catch (err) {
	  error('candles_OHLCV', err)
	}

}

// Dev & Testing */
let _interval = 15
let _query = null
let _smoothing_window = 15

async function dev_test () {
	try {

		log.black(await self.candles_OHLCV(_interval, _query))

		log.lightBlue(await self.candles_stats(_interval, _query))

		log.lightMagenta(await self.candles_moving_avg(_interval, _smoothing_window))

	} catch (err) {
	  error('dev_test', err)
	}
}

if (_dev) {

	(async function () {
		await dev_test()
	})()

}