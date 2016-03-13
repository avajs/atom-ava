/** @babel */

import TerminalCommandExecutor from '../lib/terminal-command-executor';
import ChildProcess from 'child_process';
import FakeSpawn from './fake-spawn';

describe('TerminalCommandExecutor', () => {
	let executor = {};
	let fake = {};
	let stdOutData = {};
	let exitCode = {};

	beforeEach(() => {
		stdOutData = '';
		exitCode = -1;
		fake = new FakeSpawn();
		executor = new TerminalCommandExecutor();
		spyOn(ChildProcess, 'spawn').andReturn(fake);
		spyOn(fake, 'kill');
	});

	it('can be created', () => expect(executor).not.toBeNull());

	it('writes the command and exits if not destination folder is provided', () => {
		executor.run('command');
		expect(fake.commandsReceived[0]).toBe('command\n');
		expect(fake.commandsReceived[1]).toBe('exit\n');
	});

	it('writes the folder, command and exits if folder is provided', () => {
		executor.run('command', 'dir');
		expect(fake.commandsReceived[0]).toBe('cd "dir" && command\n');
		expect(fake.commandsReceived[1]).toBe('exit\n');
	});

	it('calls the callback when new data appears in stdout', () => {
		executor.run('command');
		executor.on('dataReceived', data => {
			stdOutData = data;
		});
		fake.stdout.write('some data');
		expect(stdOutData).toBe('some data');
	});

	it('calls the callback when the stream is closed', () => {
		executor.run('command');
		executor.on('dataFinished', code => {
			exitCode = code;
		});
		fake.emulateClose();
		expect(exitCode).toBe(1);
	});

	it('cancels the current execution', () => {
		executor.run('command');
		executor.cancelExecution();
		expect(fake.kill).toHaveBeenCalled();
	});

	it('cancels the current execution if launched several times', () => {
		executor.run('command');
		executor.run('command');
		expect(fake.kill).toHaveBeenCalled();
	});
});
