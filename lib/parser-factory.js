/** @babel */
import parser from 'tap-parser';

export default class ParserFactory {
	getParser() {
		return parser();
	}
}
