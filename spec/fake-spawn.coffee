module.exports =
  class FakeSpawn
    self = []
    constructor: ->
      self = @
      @commandsReceived = []

    on: (event, callback) ->
      @mainCallBack = callback

    emulateClose: ->
      @mainCallBack(0)

    stdout: {
      write: (data) ->
        @stdOutCallBack data
      on: (event, callback) ->
        @stdOutCallBack = callback
    }

    stderr: {
      write: (data) ->
        @stdErrCallBack data
      on: (event, callback) ->
        @stdErrCallBack = callback
    }

    stdin: {
      write: (command) =>
        self.commandsReceived.push command
    }
