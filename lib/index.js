/** @babel */
import path from 'path';
import {CompositeDisposable} from 'atom';
import Panel from './panel';
import TestRunnerProcess from './test-runner-process';

module.exports = {
	activate(state) {
		this.initRunnerProcess();
		this.initUI(state);

		this.subscriptions = new CompositeDisposable();

		this.subscriptions.add(
			atom.commands.add('atom-workspace', 'ava:run-file', () => this.run()),
			atom.commands.add('atom-workspace', 'ava:run', () => this.runAll()),
			atom.commands.add('atom-workspace', 'core:cancel', ev => this.handleClosePanel(ev))
		);
	},
	handleClosePanel({target}) {
		const isFocusOnEditor = target.tagName && 'ATOM-TEXT-EDITOR' && !target.hasAttribute('mini');
		if (isFocusOnEditor && this.atomPanel.isVisible()) {
			this.hidePanel();
		}
	},
	hidePanel() {
		this.atomPanel.hide();
	},
	initRunnerProcess() {
		this.testRunnerProcess = new TestRunnerProcess();
		this.testRunnerProcess.on('assert', result => this.panel.renderAssert(result));
		this.testRunnerProcess.on('complete', results => this.panel.renderFinalReport(results));
	},
	initUI() {
		this.panel = new Panel(this);
		this.panel.renderBase();
		this.atomPanel = atom.workspace.addRightPanel({
			item: this.panel,
			visible: false
		});
	},
	canRun() {
		return atom.workspace.getActiveTextEditor() && this.testRunnerProcess.canRun();
	},
	run() {
		if (!this.atomPanel.isVisible()) {
			this.atomPanel.show();
		}

		if (!this.canRun()) {
			return;
		}

		const editor = atom.workspace.getActiveTextEditor();
		const currentFileName = editor.getPath();
		const folder = path.dirname(currentFileName);
		const file = path.basename(currentFileName);

		this.panel.renderStartProcess();
		this.testRunnerProcess.run(folder, file);
	},
	runAll() {
		if (!this.atomPanel.isVisible()) {
			this.atomPanel.show();
		}

		if (!this.canRun()) {
			return;
		}

		const editor = atom.workspace.getActiveTextEditor();
		const currentFileName = editor.getPath();
		const paths = editor.project.getPaths();
		const selectedProject = paths.filter(p => currentFileName.startsWith(p));

		this.panel.renderStartProcess();
		this.testRunnerProcess.runAll(selectedProject);
	},
	deactivate() {
		this.subscriptions.dispose();
		this.panel.destroy();
	},
	serialize() {
		this.atomAva = this.panel.serialize();
	}
};
