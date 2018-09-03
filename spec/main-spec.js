/** @babel */
import AvaPanel from '../lib/ava-panel';

const getDockGivenDefault = () => {
	const panel = new AvaPanel();
	const defaultLocation = panel.getDefaultLocation();

	const {workspace} = atom;

	switch (defaultLocation) {
		case 'center':
			return workspace.getCenter();
		case 'left':
			return workspace.getLeftDock();
		case 'right':
			return workspace.getRightDock();
		default:
			return workspace.getBottomDock();
	}
};

describe('TestingForAva', () => {
	const packageName = 'ava';
	const mainSelector = '.ava';
	const runCommand = 'ava:run';
	let workspaceElement = [];
	let activationPromise = [];

	beforeEach(() => {
		workspaceElement = atom.views.getView(atom.workspace);
		activationPromise = atom.packages.activatePackage(packageName);

		const editor = {
			getPath: () => '/this/is/a/path/file.js',
			project: {
				getPaths: () => ['/path/1/', '/path/2/']
			}
		};

		spyOn(atom.workspace, 'getActiveTextEditor').andReturn(editor);
	});

	describe('when the ava:toggle event is triggered', () => {
		it('hides and shows the view', () => {
			jasmine.attachToDOM(workspaceElement);

			expect(workspaceElement.querySelector(mainSelector)).not.toExist();

			atom.commands.dispatch(workspaceElement, runCommand);

			waitsForPromise(() => activationPromise);

			runs(() => {
				const dock = getDockGivenDefault();
				expect(dock.isVisible()).toBeTruthy();
			});
		});
	});
});
