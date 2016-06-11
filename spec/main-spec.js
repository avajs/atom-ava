/** @babel */

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
				const mainElement = workspaceElement.querySelector(mainSelector);
				expect(mainElement).toBeVisible();
				atom.commands.dispatch(workspaceElement, 'core:cancel');
				expect(mainElement).not.toBeVisible();
			});
		});
	});
});
