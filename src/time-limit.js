import { performanceNow, delay } from './time'

let nextId = 0

export const TimeLimit = /** @class */ (function () {
	function TimeLimit (count, time) {
		this.count = count
		this.time = time

		this.getWaitTime = getWaitTime
		this.wait = wait
		this.run = run

		const self = this
		const history = []
		let queue = []
		let countActive = 0

		function getWaitTime () {
			const now = performanceNow()
			const time = self.time

			while (history.length) {
				if (now - history[0] <= time) {
					break
				}
				history.shift()
			}

			if (history.length + countActive < self.count) {
				return 0
			}
			
			return history.length
				? now - history[0]
				: null
		}

		let startTime

		function wait (complete) {
			if (startTime == null) {
				startTime = performanceNow()
			}

			const waitTime = getWaitTime()
			if (waitTime === 0) {
				const result = complete ? complete() : null
				runQueue()
				return result
			}

			const waiters = []
			let queueAction

			if (countActive) {
				waiters.push(new Promise(resolve => (queueAction = resolve)))
				queue.push(queueAction)
			}

			if (waitTime) {
				waiters.push(delay(waitTime))
				// console.log(`WAIT: ${waitTime}ms; ${new Date(new Date().getTime() + waitTime)}`)
			}
			// else {
			// 	await delay(0)
			// }

			return Promise
				.race(waiters)
				.then(() => {
					const queueIndex = queue.indexOf(queueAction)
					if (queueIndex >= 0) {
						queue.splice(queueIndex, 1)
					}
					if (waiters) {
						new Date().getTime()
					}

					return wait(complete)
				})
		}

		function runQueue () {
			let len = self.count - countActive
			if (len > 0) {
				const resolve = queue.splice(0, len)
				len = resolve.length
				for (let i = 0; i < len; i++) {
					resolve[i]()
				}
			}

			// console.log(countActive + '\t' + len + '\t' + queue.length)
		}

		function run (func) {
			return wait(() => {
				// console.log(countActive)

				countActive++

				let result
				try {
					result = func()
				} finally {
					if (result instanceof Promise) {
						result = result
							.catch(final)
							.then(o => {
								final()
								return o
							})
					} else {
						final()
					}
				}

				return result

				function final () {
					history.push(performanceNow())
					countActive--

					return runQueue()
				}
			})
		}

		const id = nextId++

		Object.defineProperty(this, 'id', {
			get: () => id
		})

		Object.defineProperty(this, 'debug', {
			get: function () {
				if (startTime == null) {
					startTime = performanceNow()
				}

				return {
					now: performanceNow() - startTime,
					count: this.count,
					time: this.time,
					history: history.map(o => o - startTime),
					queue: queue.length,
					countActive
				}
			}
		})
	}

	return TimeLimit
}())

export default {
	TimeLimit
}
