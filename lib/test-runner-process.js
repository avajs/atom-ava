/** @babel */

import EventEmitter from 'events';
import TerminalCommandExecutor from './terminal-command-executor';
import ParserFactory from './parser-factory';

class TestRunnerProcess extends EventEmitter {
	constructor(
		executor = new TerminalCommandExecutor(),
		parserFactory = new ParserFactory()) {
		super();

		this.eventHandlers = {};
		this.terminalCommandExecutor = executor;
		this.parserFactory = parserFactory;

		this.terminalCommandExecutor.on('dataReceived', data => this._addAvaOutput(data));
		this.terminalCommandExecutor.on('dataFinished', () => this._endAvaOutput());

		EventEmitter.call(this);
	}

	canRun() {
		return !this.isRunning;
	}

	run(folder, file) {
		if (!this.canRun()) {
			return;
		}

		this.isRunning = true;
		this.currentExecution = {passed: 0, failed: 0};

		this.parser = this.parserFactory.getParser();
		this._setHandlersOnParser(this.parser);

		const command = `ava ${file} --tap`;

		this.terminalCommandExecutor.run(command, folder);
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
