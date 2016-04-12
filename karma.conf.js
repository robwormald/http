// Karma configuration
// Generated on Wed Mar 02 2016 14:34:31 GMT-0800 (PST)

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['systemjs', 'jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher'),
      require('karma-systemjs'),
      require('karma-story-reporter')
    ],

    systemjs: {
      configFile: 'system.config.js',
      config: {
        map: {
          'zone.js': 'node_modules/zone.js/lib',
          angular2: 'node_modules/angular2',
          rxjs: 'node_modules/rxjs',
          'angular2/http': 'temp/src',
          systemjs: 'node_modules/systemjs/dist/system.js'
        },
        packages: {
          'zone.js': {
            defaultExtension: 'js'
          },
          'angular2': {
            defaultExtension: 'js'
          },
          'rxjs': {
            defaultExtension: 'js'
          },
          'src': {
            defaultExtension: 'ts'
          },
          'node_modules/angular2/bundles/angular2-polyfills.js': {
            format: 'global'
          },
          'angular2/http': {
            //  format: 'commonjs',
            defaultExtension: 'js'
          }
        }
      }
    },

    files: [
      // Just sourcemaps needed for SystemJS since karma plugin provides System
      { pattern: 'node_modules/systemjs/dist/**/*.map', included: false, watched: false },
      // Include angular2-polyfills
      'node_modules/angular2/bundles/angular2-polyfills.js',
      // Cannot wholesale include zone because load ordering matters.
      { pattern: 'node_modules/rxjs/**/*.@(js|map)', included: false, watched: false },
      { pattern: 'node_modules/angular2/**/*.js', included: false, watched: false },

      //lib code
      { pattern: 'temp/src/**/*.js', included: false, watched: true },
      'temp/test/*.js',
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['story'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Firefox'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,
    proxies: {
      '/': 'http://localhost:3001'
    }
  })
}
