'use strict';

const _ = require('lodash');
const { parse: parseConfig, extendCli } = require('./config');
const utils = require('./utils');

module.exports = (hermione, options) => {
    hermione.on(hermione.events.CLI, extendCli);

    const config = parseConfig(options);

    if (!config.enabled) {
        return;
    }

    if (hermione.isWorker()) {
        return;
    }

    let input;

    hermione.on(hermione.events.INIT, async () => {
        input = await utils.readFile(config.inputFile);
        
        hermione.config.getBrowserIds().forEach(browserId => {
            hermione.config.forBrowser(browserId).retry = 0;
            hermione.config.forBrowser(browserId).sessionsPerBrowser = 1;
            hermione.config.forBrowser(browserId).testsPerSession = input.length;
        });
    });

    hermione.on(hermione.events.AFTER_TESTS_READ, (testCollection) => {
        if (_.isEmpty(input)) {
            return;
        }

        if (config.filterTests) {
            testCollection.disableAll();
        }

        const allBrowsers = testCollection.getBrowsers();

        const dict = input.reduce((dict, { fullTitle, browserId }, i) => {
            if (config.filterTests) {
                testCollection.enableTest(fullTitle, browserId);
            }

            const browsers = browserId ? [browserId] : allBrowsers;

            browsers.forEach(browserId => {
                dict[browserId] = dict[browserId] || {};
                dict[browserId][fullTitle] = -1 * (i + 1);
            });

            return dict;
        }, {});

        Object.keys(dict).forEach(browserId => {
            testCollection.sortTests(browserId, (test1, test2) => {
                const fullTitle1 = test1.fullTitle();
                const fullTitle2 = test2.fullTitle();

                if (dict[browserId]) {
                    if (dict[browserId][fullTitle1] && dict[browserId][fullTitle2]) {
                        return dict[browserId][fullTitle2] - dict[browserId][fullTitle1];
                    } else if (dict[browserId][fullTitle1]) {
                        return -1;
                    } else if (dict[browserId][fullTitle2]) {
                        return 1;
                    }
                }

                return 0;
            });
        });
    });
};
