'use babel';

const parser = require('tap-parser');
const EventEmitter = require('events');
const TerminalCommandExecutor = require('./terminal-command-executor');

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

	run(filePath) {
		this.parser = this._getParser();
		this._setHandlersOnParser(this.parser);

		const filePathParseResult = this.filePathParser.parse(filePath);
		const command = `ava ${filePathParseResult.file} --tap`;

		this.terminalCommandExecutor.run(command, filePathParseResult.folder);
	}

	cancelExecution() {
		this.terminalCommandExecutor.cancelExecution();
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
	}

	_getParser() {
		return parser();
	}

	destroy() {
		this.terminalCommandExecutor.destroy();
	}
}

module.exports = TestRunnerProcess;
