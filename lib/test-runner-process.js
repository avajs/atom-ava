/** @babel */

import EventEmitter from 'events';
import parser from 'tap-parser';
import TerminalCommandExecutor from './terminal-command-executor';

class FilePathParser {
	parse(filePath) {
		// TODO: Fix parsing of folders and files
		const folder = filePath.substring(0, filePath.lastIndexOf('/') + 1);
		const file = filePath.split('/').pop();
		return {folder, file};
	}
}

class TestRunnerProcess extends EventEmitter {
	constructor(
    executor = new TerminalCommandExecutor(),
    filePathParser = new FilePathParser()) {
		super();

		this.eventHandlers = {};
		this.filePathParser = filePathParser;
		this.terminalCommandExecutor = executor;
		this.terminalCommandExecutor.on('dataReceived', data => this._addAvaOutput(data));
		this.terminalCommandExecutor.on('dataFinished', () => this._endAvaOutput());

		EventEmitter.call(this);
	}

	canRun() {
		return !this.isRunning;
	}

	run(filePath) {
		if (!this.canRun()) {
			return;
		}

		this.isRunning = true;

		this.parser = this._getParser();
		this._setHandlersOnParser(this.parser);

		const filePathParseResult = this.filePathParser.parse(filePath);
		const command = `ava ${filePathParseResult.file} --tap`;

		this.terminalCommandExecutor.run(command, filePathParseResult.folder);
	}

	_setHandlersOnParser(parser) {
		parser.on('assert', assert => this.emit('assert', assert));
		parser.on('complete', results => this.emit('complete', results));
	}

	_addAvaOutput(data) {
		this.parser.write(data);
	}

	_endAvaOutput() {
		this.parser.end();
		this.isRunning = false;
	}

	_getParser() {
		return parser();
	}

	destroy() {
		this.isRunning = false;
		this.terminalCommandExecutor.destroy();
	}
}

module.exports = TestRunnerProcess;
