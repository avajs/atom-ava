'use babel';

describe('TestingForAva', () => {
	const packageName = 'ava';
	const mainSelector = '.ava';
	const toggleCommand = 'ava:toggle';
	let workspaceElement = [];
	let activationPromise = [];

	beforeEach(() => {
		workspaceElement = atom.views.getView(atom.workspace);
		activationPromise = atom.packages.activatePackage(packageName);

		const editor = {buffer: {file: {path: '/this/is/a/path/file.js'}}};

		spyOn(atom.workspace, 'getActiveTextEditor').andReturn(editor);
	});

	describe('when the ava:toggle event is triggered', () => {
		it('hides and shows the view', () => {
			jasmine.attachToDOM(workspaceElement);

			expect(workspaceElement.querySelector(mainSelector)).not.toExist();

			atom.commands.dispatch(workspaceElement, toggleCommand);

			waitsForPromise(() => activationPromise);

			runs(() => {
				const mainElement = workspaceElement.querySelector(mainSelector);
				expect(mainElement).toBeVisible();
				atom.commands.dispatch(workspaceElement, toggleCommand);
				expect(mainElement).not.toBeVisible();
			});
		});
	});
});
