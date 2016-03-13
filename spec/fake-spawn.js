/** @babel */

class FakeSpawn {
	constructor() {
		this.commandsReceived = [];
		const self = this;

		this.stdout = {
			write: data => self.stdOutCallBack(data),
			on: (event, callback) => {
				self.stdOutCallBack = callback;
			}
		};
		this.stderr = {
			write: data => self.stdErrCallBack(data),
			on: (event, callback) => {
				self.stdErrCallBack = callback;
			}
		};
		this.stdin = {
			write: command => self.commandsReceived.push(command)
		};
	}

	kill() { }

	on(event, callback) {
		this.mainCallBack = callback;
	}

	emulateClose() {
		this.mainCallBack(1);
	}
}

module.exports = FakeSpawn;
