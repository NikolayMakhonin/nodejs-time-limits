// Karma configuration
// Generated on Mon Dec 10 2018 10:00:04 GMT+0200 (Eastern European Standard Time)
// const globals = require('rollup-plugin-node-globals')
const builtins = require('rollup-plugin-node-builtins')
const babel = require('rollup-plugin-babel')
const { uglify } = require('rollup-plugin-uglify')

module.exports = function (config) {
	config.set({
		browserNoActivityTimeout: 120000,
		// browserDisconnectTimeout: 120000,
		// browserSocketTimeout: 120000,
		captureTimeout: 120000,
		// processKillTimeout: 2000,

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['mocha'],

		// list of files / patterns to load in the browser
		files: [
			'node_modules/babel-polyfill/dist/polyfill.js',
			'test/**/*'
		],

		// list of files / patterns to exclude
		exclude: [
		],

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			'test/**/*': ['rollup']
		},

		rollupPreprocessor: {
			plugins: [
				// globals(),
				builtins(),
				babel(),
				uglify({
					sourcemap: {
						content: 'inline',
						url: 'inline'
					}
				})
			],
			output: {
				format: 'iife',
				name: 'karma_bundle',
				sourcemap: true // 'inline',
				// exports: 'named'
			}
		},
		
		plugins: [
			'karma-chrome-launcher',
			'karma-mocha',
			'karma-rollup-preprocessor'
		],

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['progress'], // 'log-reporter'],

		// browserConsoleLogOptions: {
		// 	level: 'debug',
		// 	format: '%m',
		// 	path: 'reports/performance.log',
		// 	terminal: true
		// },

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['Chrome'],

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: true,

		// Concurrency level
		// how many browser should be started simultaneous
		concurrency: Infinity
	})
}
