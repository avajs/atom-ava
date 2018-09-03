/** @babel */
import Parser from 'tap-parser';

export default class ParserFactory {
	getParser() {
		return new Parser();
	}
}
