'use strict';

const _ = require('lodash');
const parseArgs = require('yargs-parser');
const {root, section, option} = require('gemini-configparser');

const ENV_PREFIX = 'hermione_test_sequencer_';
const CLI_PREFIX = '--hermione-test-sequencer-';


const getParser = () => {
    return root(section({
        enabled: option({
            defaultValue: false,
            parseEnv: JSON.parse,
            parseCli: JSON.parse,
            validate: (v) => {
                if (!_.isBoolean(v)) {
                    throw new Error(`"enabled" option must be boolean, but got ${typeof v}`);
                }
            }
        }),
        inputFile: option({
            defaultValue: 'hermione-sequencer.json',
            validate: (v) => {
                if (!_.isString(v)) {
                    throw new Error(`"inputFile" option must be string, but got ${typeof v}`);
                }
            }
        }),
        filterTests: option({
            defaultValue: false,
            parseEnv: JSON.parse,
            parseCli: JSON.parse,
            validate: (v) => {
                if (!_.isBoolean(v)) {
                    throw new Error(`"enabled" option must be boolean, but got ${typeof v}`);
                }
            }
        })
    }), {envPrefix: ENV_PREFIX, cliPrefix: CLI_PREFIX});
};

module.exports = {
    parse(options) {
        const { env, argv } = process;
        const parsedOptions = getParser()({ options, env, argv });
        const { seq } = parseArgs(argv.slice(2), { boolean: ['seq'] });

        if (seq) {
            parsedOptions.enabled = true;
        }

        return parsedOptions;
    },
    extendCli(commander) {
        commander
            .option('--seq', 'Enable hermione-test-sequencer plugin');
    }
};
