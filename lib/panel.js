/** @babel */

import TestRunnerProcess from './test-runner-process';
import UiRenderer from './ui-renderer';

class Panel {
	constructor(serializedState, testRunnerProcess = new TestRunnerProcess()) {
		this.testRunnerProcess = testRunnerProcess;

		this.testRunnerProcess.on('assert', result => this.renderer.renderAssert(result));
		this.testRunnerProcess.on('complete', results => this.renderer.renderFinalReport(results));

		this.renderBase();
	}

	renderBase() {
		this.renderer = new UiRenderer();
		this.element = document.createElement('div');
		this.element.classList.add('ava');
		this.renderer.renderBase(this.element);
	}

	run() {
		if (!this.testRunnerProcess.canRun()) {
			return;
		}

		this.renderer.displayExecutingIndicator();
		this.renderer.cleanTestsContainer();
		const editor = atom.workspace.getActiveTextEditor();
		const currentFileName = editor.buffer.file.path;
		this.testRunnerProcess.run(currentFileName);
	}

	serialize() { }

	destroy() {
		this.element.remove();
	}
}

module.exports = Panel;
