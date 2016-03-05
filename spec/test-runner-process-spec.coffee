TestRunnerProcess = require '../lib/test-runner-process'
TerminalCommandExecutor = require '../lib/terminal-command-executor'

describe 'TestRunnerProcess', ->
  [runner, executor, parser] = {}

  beforeEach ->
    executor = new TerminalCommandExecutor
    parser = ((completeCallBack) ->
      write: ->
      end: () ->)()
    runner = new TestRunnerProcess(executor, parser)

  it 'can be created', ->
    expect(runner).not.toBeNull()

  it 'runs the executor with the appropriate parameters', ->
    spyOn(atom.project, 'getPaths').andReturn(['path'])
    spyOn(executor, 'run')
    runner.run('filename')
    expect(executor.run).toHaveBeenCalledWith('ava filename --tap', 'path')

  it 'redirects the output for the parser when is received', ->
    spyOn(parser, 'write')
    runner.run()
    executor.stdOutDataReceived 'newdata'
    expect(parser.write).toHaveBeenCalledWith('newdata')

  it 'closes the parser stream when the output is over', ->
    spyOn(parser, 'end')
    runner.run()
    executor.streamClosed 0
    expect(parser.end).toHaveBeenCalled()
