# hermione-test-sequencer

[Hermione](https://github.com/gemini-testing/hermione) plugin for running tests in the specified order in one session. Inspired [hermione-test-filter](https://github.com/gemini-testing/hermione-test-filter).

## Install

```
npm i -D hermione-test-sequencer
```

## Usage

Set options for the plugin in your hermione config:
```js
plugins: {
    'hermione-test-sequencer': {
        enabled: true,
        inputFile: 'some/file.json'
    }
}
```

Input file format:

```json
[
    { "fullTitle": "some-title" },
    { "fullTitle": "some-title-2", "browserId": "some-browser" },
    { "fullTitle": "some-title-2", "browserId": "some-browser-2" }
]
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `enabled` | `[Boolean]` | `false` | Enable/disable the plugin. |
| `inputFile` | `[String]` | `hermione-sequencer.json` | Path to file with tests to run. |


## Licence

MIT
