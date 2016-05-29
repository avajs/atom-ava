/** @babel */

class ExecutionContext {
	constructor() {
		this.passed = 0;
		this.failed = 0;
		this.fileName = undefined;
	}

	setSingleFile(fileName) {
		this.fileName = fileName;
	}

	isSingleFile() {
		return this.fileName;
	}

	updateFrom(assert) {
		if (assert.ok) {
			if (!assert.skip) {
				this.passed++;
			}
		} else if (!assert.todo) {
			this.failed++;
		}
	}
}

module.exports = ExecutionContext;
