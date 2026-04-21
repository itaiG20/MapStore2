const path = require("path");

module.exports = function karmaConfig(config) {
    config.set(require('./testConfig')({
        files: [
            'build/tests.smoke.webpack.js',
            { pattern: './web/client/test-resources/**/*', included: false },
            { pattern: './web/client/translations/**/*', included: false }
        ],
        browsers: ["ChromeHeadlessWebGL"],
        basePath: path.join(__dirname, ".."),
        path: path.join(__dirname, "..", "web", "client"),
        testFile: 'build/tests.smoke.webpack.js',
        singleRun: true
    }));
};

