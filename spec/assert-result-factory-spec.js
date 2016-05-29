/** @babel */

import AssertResultFactory from '../lib/assert-result-factory';

describe('TestRunnerProcess', () => {
	let factory = {};

	beforeEach(() => {
		factory = new AssertResultFactory();
	});

	it('can be created', () => expect(factory).not.toBeNull());

	it('returns assert result when a single file is executed', () => {
		const assert = {};
		const context = {isSingleFile: true, fileName: 'somefile.js'};

		const result = factory.getAssertResult(assert, context);

		expect(result.group).toBe('somefile.js');
		expect(result.assert).toBe(assert);
		expect(result.currentExecution).toBe(context);
	});

	it('returns assert result when multiple files are executed with group char', () => {
		const assert = {name: 'nameofthegroup › nameofthetest'};
		const context = {isSingleFile: false};

		const result = factory.getAssertResult(assert, context);

		expect(result.assert).toBe(assert);
		expect(result.group).toBe('nameofthegroup');
		expect(result.currentExecution).toBe(context);
	});
});
