/** @babel */
import fs from 'fs';

import EventEmitter from 'events';
import TerminalCommandExecutor from './terminal-command-executor';
import ParserFactory from './parser-factory';
import getAssertResult from './get-assert-result';
import ExecutionContext from './execution-context';

export default class TestRunnerProcess extends EventEmitter {
	constructor(
		executor = new TerminalCommandExecutor(),
		parserFactory = new ParserFactory()) {
		super();

		this.eventHandlers = {};
		this.parserFactory = parserFactory;
		this.terminalCommandExecutor = executor;

		this.terminalCommandExecutor.on('dataReceived', data => this._addAvaOutput(data));
		this.terminalCommandExecutor.on('dataFinished', () => this._endAvaOutput());

		EventEmitter.call(this);
	}

	canRun() {
		return !this.isRunning;
	}

	run(folder, file) {
		const context = new ExecutionContext();
		context.setSingleFile(file);

		const ava = this._getAvaInstance(folder);

		this._runCommand(ava, [file, '--tap'], folder, context);
	}

	runAll(folder) {
		const ava = this._getAvaInstance(folder);

		this._runCommand(ava, ['--tap'], folder, new ExecutionContext());
	}

	_getAvaInstance(path) {
		let projectPath = Array.isArray(path) ? path[0] : path;
		projectPath = atom.project.relativizePath(projectPath)[0];
		const projectAva = `${projectPath}/node_modules/.bin/ava`;

		if (projectPath && fs.existsSync(projectAva)) {
			return projectAva;
		}

		return 'ava';
	}

	_runCommand(command, args, folder, context) {
		if (!this.canRun()) {
			return;
		}

		this.isRunning = true;
		this.currentExecutionContext = context;

		this.parser = this.parserFactory.getParser();
		this._setHandlersOnParser(this.parser);

		this.terminalCommandExecutor.run(command, args, folder);
	}

	_setHandlersOnParser(parser) {
		const instance = this;

		parser.on('assert', assert => {
			this.currentExecutionContext.updateFrom(assert);

			const result = getAssertResult(assert, this.currentExecutionContext);

			instance.emit('assert', result);
		});

		parser.on('complete', results => this.emit('complete', results));
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
