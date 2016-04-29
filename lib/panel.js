/** @babel */

import HtmlRendererHelper from './html-renderer-helper';

class Panel {
	constructor(pluginInstance, htmlRendererHelper = new HtmlRendererHelper()) {
		this.htmlRendererHelper = htmlRendererHelper;
		this.pluginInstance = pluginInstance;
		this.logoUrl = 'https://raw.githubusercontent.com/sindresorhus/ava/master/media/logo.png';
	}

	renderBase() {
		this.element = document.createElement('div');
		this.element.classList.add('ava');

		const closeIcon = this.htmlRendererHelper.createContainer('close-icon', 'x');
		this.element.appendChild(closeIcon);

		closeIcon.addEventListener('click', function (e) {
			this.closePanel(e);
		}.bind(this.pluginInstance), false);

		const fileName = this.htmlRendererHelper.createContainer('file-header', 'filename.js');
		this.element.appendChild(fileName);

		const avaLogoContainer = this.htmlRendererHelper.createContainer('ava-logo-container');
		const avaLogo = this.htmlRendererHelper.createImage(this.logoUrl, 'ava-logo-image');
		avaLogoContainer.appendChild(avaLogo);
		this.element.appendChild(avaLogoContainer);

		this.testsStatistics = this.htmlRendererHelper.createContainer('test-statistics');
		this._createTestStatisticsSection(this.testsStatistics, 'passed');
		this._createTestStatisticsSection(this.testsStatistics, 'failed');
		this.element.appendChild(this.testsStatistics);

		this.executing = this.htmlRendererHelper.createContainer('executing', 'Loading');
		this.executing.style.display = 'none';
		this.element.appendChild(this.executing);

		this.testsContainer = this.htmlRendererHelper.createContainer('test-container');
		this.element.appendChild(this.testsContainer);
	}

	renderAssert(assertResult) {
		const assert = assertResult.assert;

		const newTest = this.htmlRendererHelper.createContainer('test');
		newTest.classList.add((assert.ok) ? 'ok' : 'ko');
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

	_updateTestStatisticSection(assertResult) {
		const passedContainer = document.getElementById('passed');
		const failedContainer = document.getElementById('failed');
		passedContainer.textContent = assertResult.currentExecution.passed;
		failedContainer.textContent = assertResult.currentExecution.failed;
	}

	_createTestStatisticsSection(parentContainer, containerName) {
		const container = this.htmlRendererHelper.createContainer(`test-statistics-${containerName}-container`);
		const number = this.htmlRendererHelper.createContainer('number');
		const text = this.htmlRendererHelper.createContainer('text');
		number.setAttribute('id', containerName);
		number.textContent = '-';
		text.textContent = containerName.toUpperCase();
		container.appendChild(number);
		container.appendChild(text);
		parentContainer.appendChild(container);
	}

	renderStartProcess() {
		this.displayExecutingIndicator();
		this.cleanTestsContainer();
	}

	displayExecutingIndicator() {
		this.executing.style.display = 'block';
	}

	hideExecutingIndicator() {
		this.executing.style.display = 'none';
	}

	serialize() { }

	destroy() {
		this.element.remove();
	}
}

module.exports = Panel;
