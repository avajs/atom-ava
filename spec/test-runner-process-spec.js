'use babel';

const TestRunnerProcess = require('../lib/test-runner-process');
const TerminalCommandExecutor = require('../lib/terminal-command-executor');

describe('TestRunnerProcess', () => {
  let runner = {};
  let executor = {};
  let parser = {};

  beforeEach(() => {
    executor = new TerminalCommandExecutor();

    parser = {
      on(eventName, callBack) {},
      write() {},
      end() {}
    };

    runner = new TestRunnerProcess(executor);
    spyOn(runner, '_getParser').andReturn(parser);
  });

  it('can be created', () => expect(runner).not.toBeNull());

  it('runs the executor with the appropriate parameters', () => {
    spyOn(atom.project, 'getPaths').andReturn(['path']);
    spyOn(executor, 'run');
    runner.run('/somefolder/filename');
    expect(executor.run).toHaveBeenCalledWith('ava filename --tap', '/somefolder/');
  });

  it('redirects the output for the parser when is received', () => {
    spyOn(parser, 'write');
    runner.run('/somefolder/filename');
    executor.stdOutDataReceived('newdata');
    expect(parser.write).toHaveBeenCalledWith('newdata');
  });

  it('closes the parser stream when the output is over', () => {
    spyOn(parser, 'end');
    runner.run('/somefolder/filename');
    executor.streamClosed(0);
    expect(parser.end).toHaveBeenCalled();
  });
});