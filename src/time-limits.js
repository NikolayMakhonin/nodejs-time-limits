export const TimeLimits = /** @class */ (function () {
	function TimeLimits (...timeLimits) {
		this.timeLimits = timeLimits
		this.getWaitTime = getWaitTime
		this.wait = wait
		this.run = run

		const self = this

		function getWaitTime () {
			const timeLimits = self.timeLimits
			const len = timeLimits.length

			let maxTime = 0
			for (let i = 0; i < len; i++) {
				const waitTime = timeLimits[i].getWaitTime()
				if (waitTime == null) {
					return null
				}
				if (waitTime > maxTime) {
					maxTime = waitTime
				}
			}

			return maxTime
		}

		function wait (complete) {
			const waitTime = getWaitTime()
			if (waitTime === 0) {
				return complete ? complete() : null
			}

			const timeLimits = self.getLeafTimeLimits()
			const len = timeLimits.length
			const waiters = new Array(len)

			for (let i = 0; i < len; i++) {
				waiters[i] = timeLimits[i].wait()
			}

			return Promise
				.all(waiters)
				.then(() => wait(complete))
		}

		function createSingleCallFunc (func) {
			let result
			return () => {
				if (!func) {
					return result
				}
				result = func()
				func = null
				return result
			}
		}

		function run (func) {
			return wait(() => {
				const timeLimits = self.getLeafTimeLimits()
				const len = timeLimits.length

				if (len === 0) {
					return func()
				}

				const singleCallFunc = createSingleCallFunc(func)

				let runners = new Array(len)
				let isPromise = true

				for (let i = 0; i < len; i++) {
					const promise = timeLimits[i].run(singleCallFunc)
					if (isPromise) {
						if (promise instanceof Promise) {
							runners[i] = promise
						} else {
							runners = promise
							isPromise = false
						}
					}
				}

				return isPromise
					? Promise.race(runners)
					: runners
			})
		}

		Object.defineProperty(this, 'debug', {
			get: function () {
				return this.timeLimits.map(o => o.debug)
			}
		})
	}

	TimeLimits.prototype.getLeafTimeLimits = function (result = {}) {
		const timeLimits = this.timeLimits

		const len = timeLimits.length
		for (let i = 0; i < len; i++) {
			const timeLimit = timeLimits[i]
			if (timeLimit instanceof TimeLimits) {
				timeLimit.getLeafTimeLimits(result)
			} else {
				result[timeLimit.id.toString()] = timeLimit
			}
		}

		return Object.values(result)
	}

	return TimeLimits
}())

export default {
	TimeLimits
}
