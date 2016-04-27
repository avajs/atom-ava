/** @babel */

import {CompositeDisposable} from 'atom';
import Panel from './panel.js';
import TestRunnerProcess from './test-runner-process';

module.exports = {
	activate(state) {
		this.testRunnerProcess = new TestRunnerProcess();
		this.testRunnerProcess.on('assert', result => this.panel.renderAssert(result));
		this.testRunnerProcess.on('complete', results => this.panel.renderFinalReport(results));

		this.panel = new Panel(state.testingForAvaViewState);
		this.atomPanel = atom.workspace.addRightPanel({item: this.panel, visible: false});
		this.subscriptions = new CompositeDisposable();

		this.subscriptions.add(
			atom.commands.add('atom-workspace', 'ava:toggle', () => this.toggle()));

		this.subscriptions.add(
			atom.commands.add('atom-workspace', 'ava:run', () => this.run()));
	},
	run() {
		if (!this.testRunnerProcess.canRun()) {
			return;
		}
		this.panel.renderStartProcess();
		const editor = atom.workspace.getActiveTextEditor();
		const currentFileName = editor.buffer.file.path;
		this.testRunnerProcess.run(currentFileName);
	},
	deactivate() {
		this.subscriptions.dispose();
		this.panel.destroy();
	},
	serialize() {
		this.atomAva = this.panel.serialize();
	},
	toggle() {
		if (this.atomPanel.isVisible()) {
			this.atomPanel.hide();
		} else {
			this.atomPanel.show();
			this.run();
		}
	}
};
