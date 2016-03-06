Parser = require 'tap-parser'
TerminalCommandExecutor = require './terminal-command-executor'

module.exports =
  class TestRunnerProcess
    constructor: (executor = new TerminalCommandExecutor) ->
      @terminalCommandExecutor = executor
      @terminalCommandExecutor.onDataReceived (data) => @addAvaOutput(data)
      @terminalCommandExecutor.onDataFinished => @endAvaOutput()

    run: (filePath, assertCallback, completeCallback) ->
      @parser = @getParser()
      @parser.on('assert', assertCallback)
      @parser.on('complete', completeCallback)

      #TODO: Fix parsing of folders and files
      folder = filePath.substring(0, filePath.lastIndexOf("/") + 1);
      file = filePath.split("/").pop()

      command = "ava #{file} --tap"

      @terminalCommandExecutor.run(command, folder)

    addAvaOutput: (data) ->
      @parser.write(data)

    endAvaOutput: ->
      @parser.end()

    getParser: ->
      Parser()
