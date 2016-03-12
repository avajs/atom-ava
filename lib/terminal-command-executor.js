'use babel';

const EventEmitter = require('events');
const ChildProcess = require('child_process');

class TerminalCommandExecutor extends EventEmitter {
  constructor() {
    super();
    EventEmitter.call(this);

    this.dataReceivedEventName = 'dataReceived';
    this.dataFinishedEventName = 'dataFinished';
  }

  run(command, destinyFolder = null) {
    this.command = command;
    this.destinyFolder = destinyFolder;

    let spawn = ChildProcess.spawn;

    this.terminal = spawn('bash', ['-l']);
    this.terminal.on('close', (statusCode) => this._streamClosed(statusCode));
    this.terminal.stdout.on('data', (data) => this._stdOutDataReceived(data));
    this.terminal.stderr.on('data', (data) => this._stdErrDataReceived(data));

    let terminalCommand = (this.destinyFolder)
      ? `cd \"${this.destinyFolder}\" && ${this.command}\n`
      : `${this.command}\n`;

    console.log('Launching command to terminal: #{terminalCommand}');

    this.terminal.stdin.write(terminalCommand);
    this.terminal.stdin.write('exit\n');
  }

  cancelExecution() {
    if (this.terminal)
      this.terminal.kill('SIGKILL');
  }

  _stdOutDataReceived(newData) {
    this.emit(this.dataReceivedEventName, newData.toString());
  }

  _stdErrDataReceived(newData) {
    this.emit(this.dataReceivedEventName, newData.toString());
  }

  _streamClosed(code) {
    this.emit(this.dataFinishedEventName, code);
  }
}

module.exports = TerminalCommandExecutor;
