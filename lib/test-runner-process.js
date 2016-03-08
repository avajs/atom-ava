'use babel';

const Parser = require('tap-parser');
const TerminalCommandExecutor = require('./terminal-command-executor');

class TestRunnerProcess
{
  constructor(executor = new TerminalCommandExecutor) {
    this.terminalCommandExecutor = executor;
    this.terminalCommandExecutor.onDataReceived((data) => this.addAvaOutput(data));
    this.terminalCommandExecutor.onDataFinished(() => this.endAvaOutput());
  }

  run(filePath, assertCallback, completeCallback) {
    this.parser = this.getParser();
    this.parser.on('assert', (assert) => assertCallback(assert));
    this.parser.on('complete', (results) => completeCallback(results));

    //TODO: Fix parsing of folders and files
    let folder = filePath.substring(0, filePath.lastIndexOf('/') + 1);
    let file = filePath.split('/').pop();

    let command = `ava ${file} --tap`;
    this.terminalCommandExecutor.run(command, folder);
  }

  addAvaOutput(data) {
    this.parser.write(data);
  }

  endAvaOutput() {
    this.parser.end();
  }

  getParser() {
    return Parser();
  }
}

module.exports = TestRunnerProcess;
