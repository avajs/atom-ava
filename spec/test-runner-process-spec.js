/** @babel */
import EventEmitter from 'events';
import TestRunnerProcess from '../lib/test-runner-process';
import TerminalCommandExecutor from '../lib/terminal-command-executor';
import ParserFactory from '../lib/parser-factory';

class FakeParser extends EventEmitter {
	constructor() {
		super();
		EventEmitter.call(this);
	}

	emitAssert(assert) {
		this.emit('assert', assert);
	}

	write() { }
	end() { }
}

describe('TestRunnerProcess', () => {
	let runner = {};
	let executor = {};
	let parser = {};
	let parserFactory = {};

	class TerminalCommandExecutorDouble extends TerminalCommandExecutor {
		emulateDataWrittenStdOut(data) {
			this.emit(this.dataReceivedEventName, data);
		}

		emulateDataFinished(statusCode) {
			this.emit(this.dataFinishedEventName, statusCode);
		}
	}

	beforeEach(() => {
		parser = new FakeParser();
		executor = new TerminalCommandExecutorDouble();
		parserFactory = new ParserFactory();
		spyOn(parserFactory, 'getParser').andReturn(parser);

		runner = new TestRunnerProcess(executor, parserFactory);

		spyOn(executor, 'run');
	});

	it('can be created', () => expect(runner).not.toBeNull());

	it('runs the executor with the appropriate parameters for one file', () => {
		runner.run('/somefolder/', 'filename');
		expect(executor.run).toHaveBeenCalledWith('ava', ['filename', '--tap'], '/somefolder/');
	});

	it('runs the executor with the appropriate parameters for projects', () => {
		runner.runAll('/somefolder/');
		expect(executor.run).toHaveBeenCalledWith('ava', ['--tap'], '/somefolder/');
	});

	it('redirects the output for the parser when is received', () => {
		spyOn(parser, 'write');
		runner.run('/somefolder/', 'filename');
		executor.emulateDataWrittenStdOut('newdata');
		expect(parser.write).toHaveBeenCalledWith('newdata');
	});

	it('closes the parser stream when the output is over', () => {
		spyOn(parser, 'end');
		runner.run('/somefolder/', 'filename');
		executor.emulateDataFinished(0);
		expect(parser.end).toHaveBeenCalled();
	});

	it('prevents multiple executions', () => {
		runner.run('/somefolder/', 'filename');
		runner.run('/somefolder/', 'filename');
		expect(executor.run.callCount).toBe(1);
	});

	it('informs about the state of the execution', () => {
		expect(runner.canRun()).toBe(true);
		runner.run('/somefolder/', 'filename');
		expect(runner.canRun()).toBe(false);
		executor.emulateDataFinished(0);
		expect(runner.canRun()).toBe(true);
	});

	it('emits assertion with the correct format', () => {
		const receivedAssertResults = [];
		const okAssertResult = {ok: true};
		const notOkAssertResult = {ok: false};

		runner.run('/somefolder/', 'filename');
		runner.on('assert', result => receivedAssertResults.push(result));

		parser.emitAssert(okAssertResult);
		parser.emitAssert(notOkAssertResult);

		expect(receivedAssertResults[0].assert).toBe(okAssertResult);
		expect(receivedAssertResults[0].currentExecution.passed).toBe(1);
		expect(receivedAssertResults[1].assert).toBe(notOkAssertResult);
		expect(receivedAssertResults[1].currentExecution.passed).toBe(1);
	});

	it('does not count skipped tests as success', () => {
		const receivedAssertResults = [];
		const assertResult = {
			ok: true,
			skip: true
		};
		runner.run('/somefolder/', 'filename');
		runner.on('assert', result => receivedAssertResults.push(result));

		parser.emitAssert(assertResult);

		expect(receivedAssertResults[0].assert).toBe(assertResult);
		expect(receivedAssertResults[0].currentExecution.passed).toBe(0);
		expect(receivedAssertResults[0].currentExecution.failed).toBe(0);
	});

	it('does not count todo tests as failed', () => {
		const receivedAssertResults = [];
		const assertResult = {
			ok: false,
			todo: true
		};
		runner.run('/somefolder/', 'filename');
		runner.on('assert', result => receivedAssertResults.push(result));

		parser.emitAssert(assertResult);

		expect(receivedAssertResults[0].assert).toBe(assertResult);
		expect(receivedAssertResults[0].currentExecution.passed).toBe(0);
		expect(receivedAssertResults[0].currentExecution.failed).toBe(0);
	});
});
