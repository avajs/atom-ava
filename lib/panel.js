/** @babel */
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
		this.element.innerHTML = fs.readFileSync(path.resolve(__dirname, '../views/panel.html'));
		const closeIcon = this.element.getElementsByClassName('close-icon')[0];
		closeIcon.addEventListener('click', () => this.pluginInstance.hidePanel());

		this.groupsContainer = this.element.getElementsByClassName('tests-groups-container')[0];
	}

	renderStartProcess() {
		this.displayExecutingIndicator();
		this.cleanTestsContainer();
	}

	renderAssert(assertResult) {
		if (!assertResult.group) {
			return;
		}

		const assert = assertResult.assert;

		const groupTestsContainer = `grouptests-${assertResult.group}`;

		this.createNewGroupContainer(assertResult, groupTestsContainer);

		const testsContainer = document.getElementById(groupTestsContainer);

		const newTest = this.htmlRendererHelper.createContainer('test');
		newTest.classList.add(this._getCssClassForAssert(assert));
		newTest.textContent = `${assert.name}`;
		testsContainer.appendChild(newTest);

		this._updateTestStatisticSection(assertResult);
	}

	createNewGroupContainer(assertResult, groupTestsContainer) {
		const groupHeaderIdentifier = `group-${assertResult.group}`;
		const groupContainer = document.getElementById(groupHeaderIdentifier);

		if (groupContainer) {
			return;
		}

		const newGroupHeader = this.htmlRendererHelper.createContainer('group-header');
		newGroupHeader.textContent = assertResult.group;
		newGroupHeader.setAttribute('id', groupHeaderIdentifier);

		const newTestsContainer = this.htmlRendererHelper.createContainer('tests-container');
		newTestsContainer.setAttribute('id', groupTestsContainer);

		this.groupsContainer.appendChild(newGroupHeader);
		this.groupsContainer.appendChild(newTestsContainer);
	}

	renderFinalReport(results) {
		this.hideExecutingIndicator();

		const summary = this.htmlRendererHelper.createContainer('summary');
		const passed = results.pass - (results.skip ? results.skip : 0);
		const percentage = results.count ? Math.round((passed / results.count) * 100) : 0;
		summary.textContent = `${results.count} total - ${percentage}% passed`;

		this.groupsContainer.appendChild(summary);
	}

	cleanTestsContainer() {
		this.groupsContainer.innerHTML = '';
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

	_getCssClassForAssert(assert) {
		if (assert.ok) {
			return assert.skip ? 'skipped' : 'ok';
		}

		return assert.todo ? 'todo' : 'not-ok';
	}

	serialize() { }

	destroy() {
		this.element.remove();
	}
}

module.exports = Panel;
