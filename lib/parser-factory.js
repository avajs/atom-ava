/** @babel */
import parser from 'tap-parser';

class ParserFactory {
	getParser() {
		return parser();
	}
}

module.exports = ParserFactory;
