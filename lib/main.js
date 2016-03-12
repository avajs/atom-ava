'use babel';

const Panel = require('./panel');
const {CompositeDisposable} = require('atom');

module.exports = {
	activate(state) {
		this.panel = new Panel(state.testingForAvaViewState);
		this.atomPanel = atom.workspace.addRightPanel({item: this.panel, visible: false});
		this.subscriptions = new CompositeDisposable();

		this.subscriptions.add(
			atom.commands.add('atom-workspace', 'ava:toggle', () => this.toggle()));

		this.subscriptions.add(
			atom.commands.add('atom-workspace', 'ava:run', () => this.panel.run()));
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
			this.panel.cancelExecution();
			this.atomPanel.hide();
		} else {
			this.atomPanel.show();
			this.panel.run();
		}
	}
};
