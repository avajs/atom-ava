/** @babel */
import EventEmitter from 'events';
import childProcess from 'child_process';

class TerminalCommandExecutor extends EventEmitter {
	constructor() {
		super();
		EventEmitter.call(this);

		this.dataReceivedEventName = 'dataReceived';
		this.dataFinishedEventName = 'dataFinished';
	}

	run(command, destinyFolder) {
		this.command = command;
		this.destinyFolder = destinyFolder;

		const spawn = childProcess.spawn;

		this.terminal = spawn('bash', ['-l']);
		this.terminal.on('close', statusCode => this._streamClosed(statusCode));
		this.terminal.stdout.on('data', data => this._stdOutDataReceived(data));
		this.terminal.stderr.on('data', data => this._stdErrDataReceived(data));

		const terminalCommand = this.destinyFolder ?
			`cd \"${this.destinyFolder}\" && ${this.command}\n` :
			`${this.command}\n`;

		this.terminal.stdin.write(terminalCommand);
		this.terminal.stdin.write('exit\n');
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
