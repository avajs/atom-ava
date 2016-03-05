{Emitter} = require 'event-kit'
ChildProcess = require 'child_process'

module.exports =
  class TerminalCommandExecutor
    constructor: ->
      @emitter = new Emitter

    run: (command, destinyFolder = null) ->
      @command = command
      @destinyFolder = destinyFolder

      spawn = ChildProcess.spawn

      terminal = spawn("bash", ["-l"])
      terminal.on 'close', @streamClosed
      terminal.stdout.on 'data', @stdOutDataReceived
      terminal.stderr.on 'data', @stdErrDataReceived

      terminalCommand = if @destinyFolder then "cd \"#{@destinyFolder}\" && #{@command}\n" else "#{@command}\n"

      console.log "Launching command to terminal: #{terminalCommand}"

      terminal.stdin.write(terminalCommand)
      terminal.stdin.write("exit\n")

    stdOutDataReceived: (newData) =>
      @emitter.emit 'onStdOutData', newData.toString()

    stdErrDataReceived: (newData) =>
      @emitter.emit 'onStdErrData', newData.toString()

    streamClosed: (code) =>
      @emitter.emit 'onFinishData', code

    onDataReceived: (callback) ->
      @emitter.on 'onStdOutData', callback

    onDataFinished: (callback) ->
      @emitter.on 'onFinishData', callback

    destroy: ->
      @emitter.dispose()
