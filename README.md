[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Node.js Version][node-version-image]][node-version-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

# Description

**Queue of async functions (using promises) with multiple time limits or time limits tree**

# Examples

```js
let { TimeLimit, TimeLimits } = require('time-limits')

const timeLimit = new TimeLimit(
	5, // max active functions
	10000 // per 10000 milliseconds
)

const timeLimits = new TimeLimits( // combine time limits
	timeLimit,
	timeLimit, // if you add strict equal instances only one will be used
	new TimeLimit(10, 60 * 1000),
	// you can create time limits tree
	new TimeLimits(new TimeLimit(1, 10000), new TimeLimit(5, 5 * 60 * 10000))
)

// run functions
const tasks = []
for (let i = 0; i < 100; i++) {
	tasks.push(timeLimits.run(() => console.log(i)))
}

for (let i = 0; i < 100; i++) {
	tasks.push(timeLimits.run(async () => console.log(i)))
}

for (let i = 0; i < 100; i++) {
	tasks.push(timeLimits.run(() => new Promise(resolve => {
		setTimeout(() => {
			console.log(i)
			resolve()
		}, 100)
	})))
}

Promise
	.all(tasks)
	.then(() => {
		console.log('completed')
	});

// OR

(async () => {
	await Promise.all(tasks)
	console.log('completed')
})()
```

# License

[CC0-1.0](LICENSE)

[npm-image]: https://img.shields.io/npm/v/time-limits.svg
[npm-url]: https://npmjs.org/package/time-limits
[node-version-image]: https://img.shields.io/node/v/time-limits.svg
[node-version-url]: https://nodejs.org/en/download/
[travis-image]: https://travis-ci.org/NikolayMakhonin/nodejs-time-limits.svg?branch=master
[travis-url]: https://travis-ci.org/NikolayMakhonin/nodejs-time-limits
[coveralls-image]: https://coveralls.io/repos/github/NikolayMakhonin/nodejs-time-limits/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/NikolayMakhonin/nodejs-time-limits?branch=master
[downloads-image]: https://img.shields.io/npm/dm/time-limits.svg
[downloads-url]: https://npmjs.org/package/time-limits