# AVA [![Build Status](https://travis-ci.org/avajs/atom-ava.svg?branch=master)](https://travis-ci.org/avajs/atom-ava)

> Snippets for [AVA](https://ava.li) and run tests directly in the editor

<img src="https://github.com/avajs/atom-ava/raw/master/media/screenshot.gif" width="598">


## Install

```
$ apm install ava
```

Or, Settings → Install → Search for `ava`


## Snippets

Included are some [snippets](snippets/ava.json) useful for writing AVA tests.

Start writing a snippet's `prefix` and then press <kbd>Tab ↹</kbd> to expand the snippet.

Snippets are fuzzy matched, so you can for example just write `tde` to get the `t.deepEqual()` snippet.


## Run tests directly in the editor *(Work in progress)*

<img src="https://github.com/avajs/atom-ava/raw/master/media/test-panel.gif" width="500">

Open a test file, then choose the `Ava: Run` command in the Command Palette or press <kbd>Ctrl</kbd> <kbd>Alt</kbd> <kbd>R</kbd>, to run the tests.

*We're working on the [ability to run all tests in a project](https://github.com/avajs/atom-ava/issues/13) and more.*


## Related

- [Sublime plugin](https://github.com/avajs/sublime-ava)
- [VS Code plugin](https://github.com/samverschueren/vscode-ava)
- [Standard style version of this plugin](https://github.com/capaj/atom-ava-standard)


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
