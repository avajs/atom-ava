TestRunnerProcess = require './test-runner-process'

module.exports =
  class Panel
    constructor: (
      serializedState,
      testRunnerProcess = new TestRunnerProcess) ->
      @testRunnerProcess = testRunnerProcess
      @renderBase()

    renderBase: ->
      @element = @createElement('div', 'ava')

      message = @createElement('div', 'message')
      message.textContent = "AVA test runner"
      @element.appendChild(message)

      @executing = @createElement('div', 'executing')
      @executing.textContent = 'Loading'
      @executing.style.display = 'none'
      @element.appendChild(@executing)

      @testsContainer = @createElement('div', 'test-container')
      @element.appendChild(@testsContainer)

    run: ->
      @toggleExecutingIndicator()
      @testsContainer.innerHTML = ''
      editor = atom.workspace.getActiveTextEditor()
      currentFileName = editor.buffer.file.path
      @testRunnerProcess.run currentFileName, @renderAssert, @renderFinalReport

    renderAssert: (result) =>
      newTest = @createElement('div', 'test')
      status = if result.ok then 'OK' else 'NO'
      newTest.textContent = "#{status} - #{result.name}"
      @testsContainer.appendChild newTest

    renderFinalReport: (results) =>
      @toggleExecutingIndicator()
      summary = @createElement('div', 'summary')
      percentage = Math.round((results.pass/results.count)*100)
      summary.textContent = "#{results.count} total - #{percentage}% passed"
      @testsContainer.appendChild summary

    createElement: (elementType, cssClass = null) ->
      element = document.createElement(elementType)
      if (cssClass?)
        element.classList.add(cssClass)
      element

    toggleExecutingIndicator: =>
      if (@executing.style.display is 'block')
          @executing.style.display = 'none'
       else
          @executing.style.display = 'block'

    # Returns an object that can be retrieved when package is activated
    serialize: ->

    # Tear down any state and detach
    destroy: ->
      @element.remove()

    getElement: ->
      @element
