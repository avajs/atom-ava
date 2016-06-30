/** @babel */

module.exports = (assert, context) => {
	const groupIsolationChar = '›';

	const result = {
		assert,
		group: '',
		currentExecution: context
	};

	if (context.isSingleFile()) {
		result.group = context.fileName;
	} else if (assert.name.includes(groupIsolationChar)) {
		const tokens = assert.name.split(groupIsolationChar);

		result.group = tokens[0].trim();
		result.assert.name = tokens[1].trim();
	}

	return result;
};
