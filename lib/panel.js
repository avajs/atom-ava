/** @babel */

import TestRunnerProcess from './test-runner-process';

class Panel {
	constructor(serializedState, testRunnerProcess = new TestRunnerProcess()) {
		this.testRunnerProcess = testRunnerProcess;

		this.testRunnerProcess.on('assert', result => this.renderAssert(result));
		this.testRunnerProcess.on('complete', results => this.renderFinalReport(results));

		this.renderBase();
	}

	renderBase() {
		this.element = this.createElement('div', 'ava');
		const message = this.createElement('div', 'message');
		message.textContent = 'AVA test runner';
		this.element.appendChild(message);

		this.executing = this.createElement('div', 'executing');
		this.executing.textContent = 'Loading';
		this.executing.style.display = 'none';
		this.element.appendChild(this.executing);

		this.testsContainer = this.createElement('div', 'test-container');
		this.element.appendChild(this.testsContainer);
	}

	run() {
		if (!this.testRunnerProcess.canRun()) {
			return;
		}

		this.displayExecutingIndicator();
		this.testsContainer.innerHTML = '';
		const editor = atom.workspace.getActiveTextEditor();
		const currentFileName = editor.buffer.file.path;
		this.testRunnerProcess.run(currentFileName);
	}

	renderAssert(assert) {
		const newTest = this.createElement('div', 'test');
		const status = (assert.ok) ? 'OK' : 'NO';
		newTest.textContent = `${status} - ${assert.name}`;
		this.testsContainer.appendChild(newTest);
	}

	renderFinalReport(results) {
		this.hideExecutingIndicator();

		const summary = this.createElement('div', 'summary');
		const percentage = Math.round((results.pass / results.count) * 100);
		summary.textContent = `${results.count} total - ${percentage}% passed`;

		this.testsContainer.appendChild(summary);
	}

	createElement(elementType, cssClass = null) {
		const element = document.createElement(elementType);
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

	serialize() { }

	destroy() {
		this.element.remove();
	}
}

module.exports = Panel;
