/** @babel */

class AssertResultFactory {
	constructor() {
		this.groupIsolationChar = '›';
	}

	getAssertResult(assert, context) {
		const result = {
			assert,
			group: '',
			currentExecution: context
		};

		if (context.isSingleFile()) {
			result.group = context.fileName;
		} else if (assert.name.includes(this.groupIsolationChar)) {
			result.group = assert
				.name
				.split(this.groupIsolationChar)[0]
				.trim();
		}

		return result;
	}
}

module.exports = AssertResultFactory;
