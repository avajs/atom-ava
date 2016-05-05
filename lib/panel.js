/** @babel */
/* global __dirname */

import path from 'path';
import fs from 'fs';
import HtmlRendererHelper from './html-renderer-helper';

class Panel {
	constructor(pluginInstance, htmlRendererHelper = new HtmlRendererHelper()) {
		this.htmlRendererHelper = htmlRendererHelper;
		this.pluginInstance = pluginInstance;
		this.loadingSelector = 'sk-three-bounce';
	}

	renderBase() {
		this.element = document.createElement('div');
		this.element.classList.add('ava');

		const resolvedPath = path.resolve(__dirname, '../views/panel.html');
		this.element.innerHTML = fs.readFileSync(resolvedPath);

		this.testsContainer = this.element.getElementsByClassName('tests-container')[0];
		const closeIcon = this.element.getElementsByClassName('close-icon')[0];
		closeIcon.addEventListener('click', e => this.pluginInstance.closePanel(e), false);
	}

	renderAssert(assertResult) {
		const assert = assertResult.assert;

		const newTest = this.htmlRendererHelper.createContainer('test');
		newTest.classList.add(this._getCssClassForAssert(assert));
		newTest.textContent = `${assert.name}`;
		this.testsContainer.appendChild(newTest);

		this._updateTestStatisticSection(assertResult);
	}

	_getCssClassForAssert(assert) {
		if (assert.ok) {
			return (assert.skip) ? 'skipped' : 'ok';
		}
		return (assert.todo) ? 'todo' : 'ko';
	}

	renderFinalReport(results) {
		this.hideExecutingIndicator();

		const summary = this.htmlRendererHelper.createContainer('summary');
		const passed = results.pass - (results.skip ? results.skip : 0);
		const percentage = Math.round((passed / results.count) * 100);
		summary.textContent = `${results.count} total - ${percentage}% passed`;

		this.testsContainer.appendChild(summary);
	}

	cleanTestsContainer() {
		this.testsContainer.innerHTML = '';
	}

	renderStartProcess(fileName) {
		const fileHeader = document.getElementById('file-header');
		fileHeader.textContent = fileName;

		this.displayExecutingIndicator();
		this.cleanTestsContainer();
	}

	displayExecutingIndicator() {
		const executing = document.getElementById(this.loadingSelector);
		if (executing) {
			executing.style.display = 'block';
		}
	}

	hideExecutingIndicator() {
		const executing = document.getElementById(this.loadingSelector);
		if (executing) {
			executing.style.display = 'none';
		}
	}

	_updateTestStatisticSection(assertResult) {
		const passedContainer = document.getElementById('passed');
		const failedContainer = document.getElementById('failed');
		passedContainer.textContent = assertResult.currentExecution.passed;
		failedContainer.textContent = assertResult.currentExecution.failed;
	}

	serialize() { }

	destroy() {
		this.element.remove();
	}
}

module.exports = Panel;
