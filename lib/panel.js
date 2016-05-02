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
		newTest.classList.add(assert.ok ? 'ok' : 'ko');
		newTest.textContent = `${assert.name}`;
		this.testsContainer.appendChild(newTest);

		this._updateTestStatisticSection(assertResult);
	}

	renderFinalReport(results) {
		this.hideExecutingIndicator();

		const summary = this.htmlRendererHelper.createContainer('summary');
		const percentage = Math.round((results.pass / results.count) * 100);
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
		executing.style.display = 'block';
	}

	hideExecutingIndicator() {
		const executing = document.getElementById(this.loadingSelector);
		executing.style.display = 'none';
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
