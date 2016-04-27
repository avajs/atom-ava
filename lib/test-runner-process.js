/** @babel */

import EventEmitter from 'events';
import TerminalCommandExecutor from './terminal-command-executor';
import ParserFactory from './parser-factory'

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
		parserFactory = new ParserFactory(),
		filePathParser = new FilePathParser()) {
		super();

		this.eventHandlers = {};
		this.filePathParser = filePathParser;
		this.terminalCommandExecutor = executor;
		this.parserFactory = parserFactory;

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
		this.currentExecution = {passed: 0, failed: 0};

		this.parser = this.parserFactory.getParser();
		this._setHandlersOnParser(this.parser);

		const filePathParseResult = this.filePathParser.parse(filePath);
		const command = `ava ${filePathParseResult.file} --tap`;

		this.terminalCommandExecutor.run(command, filePathParseResult.folder);
	}

	_setHandlersOnParser(parser) {
		const instance = this;
		parser.on('assert', assert => {
			instance._updateCurrentExecution(assert);
			const result = {
				currentExecution: this.currentExecution, assert
			};
			instance.emit('assert', result);
		});

		parser.on('complete', results => this.emit('complete', results));
	}

	_updateCurrentExecution(assert) {
		if (assert.ok) {
			this.currentExecution.passed++;
		} else {
			this.currentExecution.failed++;
		}
	}

	_addAvaOutput(data) {
		this.parser.write(data);
	}

	_endAvaOutput() {
		this.parser.end();
		this.isRunning = false;
	}

	destroy() {
		this.isRunning = false;
		this.terminalCommandExecutor.destroy();
	}
}

module.exports = TestRunnerProcess;
