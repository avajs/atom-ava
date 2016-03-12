'use babel';

const Parser = require('tap-parser');
const EventEmitter = require('events');
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

class TestRunnerProcess extends EventEmitter {
  constructor(
    executor = new TerminalCommandExecutor,
    filePathParser = new FilePathParser) {

    super();

    this.eventHandlers = {};
    this.filePathParser = filePathParser;
    this.terminalCommandExecutor = executor;
    this.terminalCommandExecutor.on('dataReceived', (data) => this._addAvaOutput(data));
    this.terminalCommandExecutor.on('dataFinished', () => this._endAvaOutput());

    EventEmitter.call(this);
  }

  run(filePath) {
    this.parser = this._getParser();
    this._setHandlersOnParser(this.parser);

    let filePathParseResult = this.filePathParser.parse(filePath);
    let command = `ava ${filePathParseResult.file} --tap`;

    this.terminalCommandExecutor.run(command, filePathParseResult.folder);
  }

  _setHandlersOnParser(parser) {
    parser.on('assert', (assert) => this.emit('assert', assert));
    parser.on('complete', (results) => this.emit('complete', results));
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

  destroy() {
    this.terminalCommandExecutor.destroy();
  }
}

module.exports = TestRunnerProcess;
