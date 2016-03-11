'use babel';

const Parser = require('tap-parser');
const TerminalCommandExecutor = require('./terminal-command-executor');

class FilePathParser {
  parse(filePath) {
    //TODO: Fix parsing of folders and files
    let folder = filePath.substring(0, filePath.lastIndexOf('/') + 1);
    let file = filePath.split('/').pop();
    return {
      folder: folder,
      file: file
    };
  }
}

class TestRunnerProcess {
  constructor(
    executor = new TerminalCommandExecutor,
    filePathParser = new FilePathParser) {

    this.eventHandlers = {};
    this.filePathParser = filePathParser;
    this.terminalCommandExecutor = executor;
    this.terminalCommandExecutor.onDataReceived((data) => this._addAvaOutput(data));
    this.terminalCommandExecutor.onDataFinished(() => this._endAvaOutput());
  }

  on(event, callBack) {
    if (!['assert', 'complete'].some(e => e === event)) {
      return;
    }

    this.eventHandlers[event] = callBack;
  }

  run(filePath) {
    this.parser = this._getParser();
    this._setHandlersOnParser(this.parser);

    let filePathParseResult = this.filePathParser.parse(filePath);
    let command = `ava ${filePathParseResult.file} --tap`;

    this.terminalCommandExecutor.run(command, filePathParseResult.folder);
  }

  _setHandlersOnParser(parser) {
    if (this.eventHandlers['assert']) {
      parser.on('assert', (assert) => this.eventHandlers['assert'](assert));
    }

    if (this.eventHandlers['complete']) {
      parser.on('complete', (results) => this.eventHandlers['complete'](results));
    }
  }

  _addAvaOutput(data) {
    this.parser.write(data);
  }

  _endAvaOutput() {
    this.parser.end();
  }

  _getParser() {
    return Parser();
  }
}

module.exports = TestRunnerProcess;
