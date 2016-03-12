'use babel';

const { Emitter } = require('event-kit');
const ChildProcess = require('child_process');

class TerminalCommandExecutor {
  constructor() {
    this.emitter = new Emitter();
  }

  run(command, destinyFolder = null) {
    this.command = command;
    this.destinyFolder = destinyFolder;

    let spawn = ChildProcess.spawn;

    let terminal = spawn('bash', ['-l']);
    terminal.on('close', (statusCode) => this.streamClosed(statusCode));
    terminal.stdout.on('data', (data) => this.stdOutDataReceived(data));
    terminal.stderr.on('data', (data) => this.stdErrDataReceived(data));

    let terminalCommand = (this.destinyFolder)
      ? `cd \"${this.destinyFolder}\" && ${this.command}\n`
      : `${this.command}\n`;

    console.log('Launching command to terminal: #{terminalCommand}');

    terminal.stdin.write(terminalCommand);
    terminal.stdin.write('exit\n');
  }

  stdOutDataReceived(newData) {
    this.emitter.emit('onStdOutData', newData.toString());
  }

  stdErrDataReceived(newData) {
    this.emitter.emit('onStdErrData', newData.toString());
  }

  streamClosed(code) {
    this.emitter.emit('onFinishData', code);
  }

  onDataReceived(callback) {
    this.emitter.on('onStdOutData', callback);
  }

  onDataFinished(callback) {
    this.emitter.on('onFinishData', callback);
  }

  destroy() {
    this.emitter.dispose();
  }
}

module.exports = TerminalCommandExecutor;
