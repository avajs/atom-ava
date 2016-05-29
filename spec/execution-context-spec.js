/** @babel */

import ExecutionContext from '../lib/execution-context';

describe('ExecutionContext', () => {
	let context = {};

	beforeEach(() => {
		context = new ExecutionContext();
	});

	it('gets initialised with the correct values', () => {
		expect(context.passed).toBe(0);
		expect(context.failed).toBe(0);
		expect(context.fileName).toBe(undefined);
		expect(context.isSingleFile()).toBeFalsy();
	});

	it('can run one file', () => {
		context.setSingleFile('filename.js');

		expect(context.fileName).toBe('filename.js');
		expect(context.isSingleFile()).toBeTruthy();
	});

	it('processes correctly ok asserts', () => {
		context.updateFrom({ok: true});

		expect(context.passed).toBe(1);
	});

	it('processes correctly failed asserts', () => {
		context.updateFrom({ok: false});

		expect(context.failed).toBe(1);
	});

	it('does not take into account skipped tests', () => {
		context.updateFrom({ok: true, skip: true});

		expect(context.failed).toBe(0);
	});

	it('does not take into account todo tests', () => {
		context.updateFrom({ok: false, todo: true});

		expect(context.failed).toBe(0);
	});
});
