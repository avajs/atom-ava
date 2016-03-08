'use babel';

describe('TestingForAva', () => {
  let packageName = 'ava';
  let mainSelector = '.ava';
  let toggleCommand = 'ava:toggle';
  let workspaceElement = [];
  let activationPromise = [];

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage(packageName);
  });

  describe('when the ava:toggle event is triggered', () => {
    it('hides and shows the view', () => {
      jasmine.attachToDOM(workspaceElement);

      expect(workspaceElement.querySelector(mainSelector)).not.toExist();

      atom.commands.dispatch(workspaceElement, toggleCommand);

      waitsForPromise(() => activationPromise);

      runs(() => {
        let mainElement = workspaceElement.querySelector(mainSelector);
        expect(mainElement).toBeVisible();
        atom.commands.dispatch(workspaceElement, toggleCommand);
        expect(mainElement).not.toBeVisible();
      });
    });
  });
});
