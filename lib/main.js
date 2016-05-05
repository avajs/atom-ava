/** @babel */

import path from 'path';
import {CompositeDisposable} from 'atom';
import Panel from './panel.js';
import TestRunnerProcess from './test-runner-process';

module.exports = {
	activate(state) {
		this.initRunnerProcess();
		this.initUI(state);

		this.subscriptions = new CompositeDisposable();

		this.subscriptions.add(
			atom.commands.add('atom-workspace', 'ava:toggle', () => this.toggle()));

		this.subscriptions.add(
			atom.commands.add('atom-workspace', 'ava:run', () => this.run()));
	},
	initRunnerProcess() {
		this.testRunnerProcess = new TestRunnerProcess();
		this.testRunnerProcess.on('assert', result => this.panel.renderAssert(result));
		this.testRunnerProcess.on('complete', results => this.panel.renderFinalReport(results));
	},
	initUI() {
		this.panel = new Panel(this);
		this.panel.renderBase();
		this.atomPanel = atom.workspace.addRightPanel({item: this.panel, visible: false});
	},
	canRun() {
		return (atom.workspace.getActiveTextEditor() && this.testRunnerProcess.canRun());
	},
	run() {
		if (!this.atomPanel.isVisible()) {
			this.toggle();
		}
		if (!this.canRun()) {
			return;
		}

		const editor = atom.workspace.getActiveTextEditor();
		const currentFileName = editor.buffer.file.path;
		const folder = path.dirname(currentFileName);
		const file = path.basename(currentFileName);

		this.panel.renderStartProcess(file);
		this.testRunnerProcess.run(folder, file);
	},
	toggle() {
		if (this.atomPanel.isVisible()) {
			this.atomPanel.hide();
		} else {
			this.atomPanel.show();
			this.run();
		}
	},
	closePanel() {
		this.atomPanel.hide();
	},
	deactivate() {
		this.subscriptions.dispose();
		this.panel.destroy();
	},
	serialize() {
		this.atomAva = this.panel.serialize();
	}
};
