{CompositeDisposable} = require 'atom'
Panel = require './panel'

module.exports = TestingForAva =
  testingForAvaView: null
  modalPanel: null
  subscriptions: null

  activate: (state) ->
    @panel = new Panel(state.testingForAvaViewState)
    @atomPanel = atom.workspace.addRightPanel(item: @panel, visible: false)

    @subscriptions = new CompositeDisposable

    @subscriptions.add atom.commands.add 'atom-workspace',
      'ava:toggle': => @toggle()
      'ava:run': => @panel.run()

  deactivate: ->
    @subscriptions.dispose()
    @panel.destroy()

  serialize: ->
    atomAva: @panel.serialize()

  toggle:  ->
    if @atomPanel.isVisible()
      @atomPanel.hide()
    else
      @atomPanel.show()
