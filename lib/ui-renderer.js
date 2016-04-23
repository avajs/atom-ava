/** @babel */

class UiRenderer {
	renderBase(container) {
		this.element = container;

		const fileName = this._createContainer('file-header');
		fileName.textContent = 'filename.js';
		this.element.appendChild(fileName);

		const avaLogoContainer = this._createContainer('ava-logo-container');
		const avaLogo = document.createElement('img');
		avaLogo.src = 'https://raw.githubusercontent.com/sindresorhus/ava/master/media/logo.png';
		avaLogo.classList.add('ava-logo-image');
		avaLogoContainer.appendChild(avaLogo);
		this.element.appendChild(avaLogoContainer);

		this.testsStatistics = this._createContainer('test-statistics');
		this._createTestStatisticsSection(this.testsStatistics, 'passed');
		this._createTestStatisticsSection(this.testsStatistics, 'failed');
		this.element.appendChild(this.testsStatistics);

		this.executing = this._createContainer('executing');
		this.executing.textContent = 'Loading';
		this.executing.style.display = 'none';
		this.element.appendChild(this.executing);

		this.testsContainer = this._createContainer('test-container');
		this.element.appendChild(this.testsContainer);
	}

	renderAssert(assertResult) {
		const assert = assertResult.assert;

		const newTest = this._createContainer('test');
		newTest.classList.add((assert.ok) ? 'ok' : 'ko');
		newTest.textContent = `${assert.name}`;
		this.testsContainer.appendChild(newTest);

		// TODO: Change assert to something as AssertResult
		// TODO: Rethink the concept
		this._updateTestStatisticSection(assertResult);
	}

	renderFinalReport(results) {
		this.hideExecutingIndicator();

		const summary = this._createContainer('div', 'summary');
		const percentage = Math.round((results.pass / results.count) * 100);
		summary.textContent = `${results.count} total - ${percentage}% passed`;

		this.testsContainer.appendChild(summary);
	}

	cleanTestsContainer() {
		this.testsContainer.innerHTML = '';
	}

	// TODO: The class name should be extracted to a constant
	// TODO: Maybe this generalization shouldn't be done a the container
	// TODO: Should be a member, or have some class to deal with it.
	_updateTestStatisticSection(assertResult) {
		const passedContainer = document.getElementById('passed');
		const failedContainer = document.getElementById('failed');
		passedContainer.textContent = assertResult.currentExecution.passed;
		failedContainer.textContent = assertResult.currentExecution.failed;
	}

	_createTestStatisticsSection(parentContainer, containerName) {
		const container = this._createContainer(`test-statistics-${containerName}-container`);
		const number = this._createContainer('number');
		const text = this._createContainer('text');
		number.setAttribute('id', containerName);
		number.textContent = '-';
		text.textContent = containerName.toUpperCase();
		container.appendChild(number);
		container.appendChild(text);
		parentContainer.appendChild(container);
	}

	_createContainer(cssClass = null) {
		const element = document.createElement('div');
		if (cssClass) {
			element.classList.add(cssClass);
		}
		return element;
	}

	displayExecutingIndicator() {
		this.executing.style.display = 'block';
	}

	hideExecutingIndicator() {
		this.executing.style.display = 'none';
	}
}

module.exports = UiRenderer;
