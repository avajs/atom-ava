/** @babel */

import getAssertResult from '../lib/get-assert-result';
import ExecutionContext from '../lib/execution-context';

describe('TestRunnerProcess', () => {
	it('can be created', () => expect(getAssertResult).not.toBeNull());

	it('returns assert result when a single file is executed', () => {
		const assert = {};
		const context = new ExecutionContext();
		context.setSingleFile('somefile.js');

		const result = getAssertResult(assert, context);

		expect(result.group).toBe('somefile.js');
		expect(result.assert).toBe(assert);
		expect(result.currentExecution).toBe(context);
	});

	it('returns assert result when multiple files are executed with group char', () => {
		const assert = {name: 'nameofthegroup › nameofthetest'};
		const context = new ExecutionContext();

		const result = getAssertResult(assert, context);

		expect(result.assert).toBe(assert);
		expect(result.group).toBe('nameofthegroup');
		expect(result.assert.name).toBe('nameofthetest');
		expect(result.currentExecution).toBe(context);
	});

	it('returns default group name when files are executed without group char', () => {
		const assert = {name: 'nameofthetest'};
		const context = new ExecutionContext();

		const result = getAssertResult(assert, context);

		expect(result.assert).toBe(assert);
		expect(result.group).toBe('results');
		expect(result.assert.name).toBe('nameofthetest');
		expect(result.currentExecution).toBe(context);
	});
});
