// Imports
const log = require('ololog').configure({locate: false})
const _ = require('lodash')
const Chance = require('chance')
const chance = new Chance()

const self = this

// Candle Helper Functions */
const _size = 0

const _interval = function (interval) {
	if (interval) {
		return `${interval}m`
	} else {
		return '1m'
	}
}

const _query = function (query) {
	if (query) {
		return query
	} else {
		return {
			match_all: {}
		}
	}
}

const _smoothing_window = function (interval, smoothing_window) {
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

const _ma_model = function (ma_model) {
	if (ma_model) {
		return ma_model
	} else {
		return 'ewma'
	}
}

const _alpha = function (alpha) {
	if (alpha) {
		return alpha
	} else {
		return 0.5 // min: 0 - max: 1
	}
}

const _error = function (method, err, socket) {
	log.lightYellow(`${method}__ERROR `, err.message)
	if (socket) {
		socket.emit(`${method}__ERROR `, err.message)
	}
}


// Main Export Candle Methods */
module.exports.OHLCV = async function (interval, query) {

	try {

		let body = {

			size: _size,
			query: _query(query),

			// INTERVAL */
			aggs: {
				'the_interval': {
					date_histogram: {
						field: 'date',
						interval: _interval(interval)
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
								sort: [ { 'date': { order: 'desc' }} ],
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
		_error('candles_OHLCV', err)
	}

}

module.exports.moving_avg = async function (interval, smoothing_window, ma_model, alpha, query) {

	try {

		let body = {
			size: _size,
			query: _query(query),
			aggs: {

				// INTERVAL */
				'the_interval': {
					date_histogram: {
						field: 'date',
						interval: _interval(interval)
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
								window: _smoothing_window(smoothing_window),
								model: _ma_model(ma_model),
								settings: {
									alpha: _alpha(alpha)
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
								window: _smoothing_window(smoothing_window),
								model: _ma_model(ma_model),
								settings: {
									alpha: _alpha(alpha)
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
								window: _smoothing_window(smoothing_window),
								model: _ma_model(ma_model),
								settings: {
									alpha: _alpha(alpha)
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
								window: _smoothing_window(smoothing_window),
								model: _ma_model(ma_model),
								settings: {
									alpha: _alpha(alpha)
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
								window: _smoothing_window(smoothing_window),
								model: _ma_model(ma_model),
								settings: {
									alpha: _alpha(alpha)
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
								window: _smoothing_window(smoothing_window),
								model: _ma_model(ma_model),
								settings: {
									alpha: _alpha(alpha)
								}
							}
						}
					}
				}
			}
		}

		return JSON.stringify(body)

	} catch (err) {
		_error('candles_moving_avg', err)
	}

}

module.exports.stats = async function (interval, query) {

	try {

		let body = {
			size: _size,
			query: _query(query),
			aggs: {

				// INTERVAL */
				'the_interval': {
					date_histogram: {
						field: 'date',
						interval: _interval(interval)
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
		_error('candles_stats', err)
	}

}


// Dev & Testing */
let __dev = true
let __candle_data_model = {

	'time': 1539558720,

	'close': 6361.69,
	'high': 6362.19,
	'low': 6361.37,
	'open': 6361.37,

	'volumefrom': 28.25,
	'volumeto': 179718.33,

	'timestamp': 1539558720000,
	'date': '2018-10-14T23:12:00.000Z'

	// source: https://min-api.cryptocompare.com */
}

let __interval = 15
let __query = null
let __smoothing_window = 15

async function dev_test () {
	try {

		log.black(await self.OHLCV(__interval, __query))

		log.lightMagenta(await self.moving_avg(__interval, __smoothing_window))

		log.lightBlue(await self.stats(__interval, __query))

	} catch (err) {
	  error('dev_test', err)
	}
}

if (__dev) {

	(async function () {
		await dev_test()
	})()

}