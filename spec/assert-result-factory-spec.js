/** @babel */

import AssertResultFactory from '../lib/assert-result-factory';
import ExecutionContext from '../lib/execution-context';

describe('TestRunnerProcess', () => {
	let factory = {};

	beforeEach(() => {
		factory = new AssertResultFactory();
	});

	it('can be created', () => expect(factory).not.toBeNull());

	it('returns assert result when a single file is executed', () => {
		const assert = {};
		const context = new ExecutionContext();
		context.setSingleFile('somefile.js');

		const result = factory.getAssertResult(assert, context);

		expect(result.group).toBe('somefile.js');
		expect(result.assert).toBe(assert);
		expect(result.currentExecution).toBe(context);
	});

	it('returns assert result when multiple files are executed with group char', () => {
		const assert = {name: 'nameofthegroup › nameofthetest'};
		const context = new ExecutionContext();

		const result = factory.getAssertResult(assert, context);

		expect(result.assert).toBe(assert);
		expect(result.group).toBe('nameofthegroup');
		expect(result.currentExecution).toBe(context);
	});
});
