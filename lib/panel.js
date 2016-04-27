/** @babel */

import UiRenderer from './ui-renderer';

class Panel {
	constructor() {
		this._renderBase();
	}

	_renderBase() {
		this.renderer = new UiRenderer();
		this.element = document.createElement('div');
		this.element.classList.add('ava');
		this.renderer.renderBase(this.element);
	}

	renderStartProcess() {
		this.renderer.displayExecutingIndicator();
		this.renderer.cleanTestsContainer();
	}

	renderAssert(result) {
		this.renderer.renderAssert(result);
	}

	renderFinalReport(results) {
		this.renderer.renderFinalReport(results);
	}

	serialize() { }

	destroy() {
		this.element.remove();
	}
}

module.exports = Panel;
