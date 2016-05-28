/** @babel */
import EventEmitter from 'events';
import {BufferedProcess} from 'atom';

class TerminalCommandExecutor extends EventEmitter {
	constructor() {
		super();
		EventEmitter.call(this);

		this.dataReceivedEventName = 'dataReceived';
		this.dataFinishedEventName = 'dataFinished';
	}

	run(command, args, destinyFolder) {
		this.command = command;
		this.destinyFolder = destinyFolder;

		const folder = Array.isArray(destinyFolder) ?
			destinyFolder[0] :
			destinyFolder;

		const process = new BufferedProcess({
			command,
			args,
			options: {cwd: folder},
			stdout: this._stdOutDataReceived.bind(this),
			exit: this._streamClosed.bind(this)
		});

		process.onWillThrowError(() => {
			atom.notifications.addError('[AVA] Unknown error', {
				detail: 'Something happened while trying to execute AVA',
				dismissable: true
			});
		});
	}

	_stdOutDataReceived(newData) {
		this.emit(this.dataReceivedEventName, newData);
	}

	_streamClosed(code) {
		if (code === 127) {
			atom.notifications.addError('[AVA] Command not found', {
				detail: 'AVA was not found. Make sure it\'s installed.',
				dismissable: true
			});
		}
		this.emit(this.dataFinishedEventName, code);
	}
}

module.exports = TerminalCommandExecutor;
