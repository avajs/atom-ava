TerminalCommandExecutor = require './terminal-command-executor'
Parser = require 'tap-parser'

module.exports =
  class TestRunnerProcess
    constructor: (
      executor = new TerminalCommandExecutor,
      parser = Parser) ->
      @avaParserStream = parser
      @terminalCommandExecutor = executor

    onCompleteEvent: (callback) ->
      @avaParserStream.on('complete', callback)

    onAssertEvent: (callback) ->
      @avaParserStream.on('assert', callback)

    run: (file) ->
      @terminalCommandExecutor.onDataReceived (data) => @addAvaOutput(data)
      @terminalCommandExecutor.onDataFinished => @endAvaOutput()

      command = "ava #{file} --tap"

      @terminalCommandExecutor.run(command, atom.project.getPaths()[0])

    addAvaOutput: (data) ->
      @avaParserStream.write(data)

    endAvaOutput: ->
      @avaParserStream.end()
