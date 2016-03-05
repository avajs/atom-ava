TestRunnerProcess = require './test-runner-process'

module.exports =
  class Panel
    constructor: (serializedState) ->
      # Create root element
      @element = document.createElement('div')
      @element.classList.add('ava')

      # Create message element
      message = document.createElement('div')
      message.textContent = "The TestingForAva package is Alive! It's ALIVE!"
      message.classList.add('message')
      @element.appendChild(message)

    run: ->

    # Returns an object that can be retrieved when package is activated
    serialize: ->

    # Tear down any state and detach
    destroy: ->
      @element.remove()

    getElement: ->
      @element
