const log = require('ololog').configure({locate: false})
const _ = require('lodash')
const Chance = require('chance')
const chance = new Chance()

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

}

function candles_moving_avg (interval, window, model, alpha, candle_count) {

	let _interval = function () {
		if (interval) {
			return `${interval}m`
		} else {
			return '1m'
		}
	}

	let _window = function () {
		if (interval && window) {
			return window
		}
		else if (interval && !window) {
			return interval
		}
		else {
			return 1
		}
	}

	let _model = function () {
		if (model) {
			return model
		} else {
			return 'ewma'
		}
	}

	let _alpha = function () {
		if (alpha) {
			return alpha
		} else {
			return 0.5
		}
	}

	let _candle_count = function () {

		// Individual candle objects you want returned
		// Default: 0 unless you want individual candle objects for some reason

		if (candle_count) {
			return candle_count
		} else {
			return 0
		}
	}

	let query = {
		size: _candle_count(),
		aggs: {
			'candles_movavg': {
				date_histogram: {
					field: 'date',
					interval: _interval()
				},
				aggs: {
					'the_sum_close': {
						sum: {
							field: 'close'
						}
					},
					'the_movavg_of_the_sum_close': {
						moving_avg: {
							buckets_path: 'the_sum_close',
							window: _window(),
							model: _model(),
							settings: {
								alpha: _alpha()
							}
						}
					},
					'the_sum_high': {
						sum: {
							field: 'high'
						}
					},
					'the_movavg_of_the_sum_high': {
						moving_avg: {
							buckets_path: 'the_sum_high',
							window: _window(),
							model: _model(),
							settings: {
								alpha: _alpha()
							}
						}
					},
					'the_sum_low': {
						sum: {
							field: 'low'
						}
					},
					'the_movavg_of_the_sum_low': {
						moving_avg: {
							buckets_path: 'the_sum_low',
							window: _window(),
							model: _model(),
							settings: {
								alpha: _alpha()
							}
						}
					},
					'the_sum_open': {
						sum: {
							field: 'open'
						}
					},
					'the_movavg_of_the_sum_open': {
						moving_avg: {
							buckets_path: 'the_sum_open',
							window: _window(),
							model: _model(),
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
							window: _window(),
							model: _model(),
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
							window: _window(),
							model: _model(),
							settings: {
								alpha: _alpha()
							}
						}
					}
				}
			}
		}
	}

	return JSON.stringify(query, null, 2)

}

function candles (interval, window, model, alpha, candle_count) {

	let _interval = function () {
		if (interval) {
			return `${interval}m`
		} else {
			return '1m'
		}
	}

	let _window = function () {
		if (interval && window) {
			return window
		}
		else if (interval && !window) {
			return interval
		}
		else {
			return 1
		}
	}

	let _model = function () {
		if (model) {
			return model
		} else {
			return 'ewma'
		}
	}

	let _alpha = function () {
		if (alpha) {
			return alpha
		} else {
			return 0.5
		}
	}

	let _candle_count = function () {

		// Individual candle objects you want returned
		// Default: 0 unless you want individual candle objects for some reason

		if (candle_count) {
			return candle_count
		} else {
			return 0
		}
	}

	let query = {
		size: _candle_count(),
		aggs: {
			'candles_movavg': {
				date_histogram: {
					field: 'date',
					interval: _interval()
				},
				aggs: {
					'the_sum_close': {
						sum: {
							field: 'close'
						}
					},
					'the_movavg_of_the_sum_close': {
						moving_avg: {
							buckets_path: 'the_sum_close',
							window: _window(),
							model: _model(),
							settings: {
								alpha: _alpha()
							}
						}
					},
					'the_sum_high': {
						sum: {
							field: 'high'
						}
					},
					'the_movavg_of_the_sum_high': {
						moving_avg: {
							buckets_path: 'the_sum_high',
							window: _window(),
							model: _model(),
							settings: {
								alpha: _alpha()
							}
						}
					},
					'the_sum_low': {
						sum: {
							field: 'low'
						}
					},
					'the_movavg_of_the_sum_low': {
						moving_avg: {
							buckets_path: 'the_sum_low',
							window: _window(),
							model: _model(),
							settings: {
								alpha: _alpha()
							}
						}
					},
					'the_sum_open': {
						sum: {
							field: 'open'
						}
					},
					'the_movavg_of_the_sum_open': {
						moving_avg: {
							buckets_path: 'the_sum_open',
							window: _window(),
							model: _model(),
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
							window: _window(),
							model: _model(),
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
							window: _window(),
							model: _model(),
							settings: {
								alpha: _alpha()
							}
						}
					}
				}
			}
		}
	}

	return JSON.stringify(query, null, 2)

}

console.log(candles_moving_avg(15, 30))