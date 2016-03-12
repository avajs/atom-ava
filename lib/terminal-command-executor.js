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

    let terminal = spawn('bash', ['-l']);
    terminal.on('close', (statusCode) => this._streamClosed(statusCode));
    terminal.stdout.on('data', (data) => this._stdOutDataReceived(data));
    terminal.stderr.on('data', (data) => this._stdErrDataReceived(data));

    let terminalCommand = (this.destinyFolder)
      ? `cd \"${this.destinyFolder}\" && ${this.command}\n`
      : `${this.command}\n`;

    console.log('Launching command to terminal: #{terminalCommand}');

    terminal.stdin.write(terminalCommand);
    terminal.stdin.write('exit\n');
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
