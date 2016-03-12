'use babel';

const TestRunnerProcess = require('./test-runner-process');

class Panel {
  constructor(serializedState, testRunnerProcess = new TestRunnerProcess) {
    this.testRunnerProcess = testRunnerProcess;

    this.testRunnerProcess.on('assert', (result) => this.renderAssert(result));
    this.testRunnerProcess.on('complete', (results) => this.renderFinalReport(results));

    this.renderBase();
  }

  renderBase() {
    this.element = this.createElement('div', 'ava');
    let message = this.createElement('div', 'message');
    message.textContent = 'AVA test runner';
    this.element.appendChild(message);

    this.executing = this.createElement('div', 'executing');
    this.executing.textContent = 'Loading';
    this.executing.style.display = 'none';
    this.element.appendChild(this.executing);

    this.testsContainer = this.createElement('div', 'test-container');
    this.element.appendChild(this.testsContainer);
  }

  run() {
    this.displayExecutingIndicator();
    this.testsContainer.innerHTML = '';
    let editor = atom.workspace.getActiveTextEditor();
    let currentFileName = editor.buffer.file.path;
    this.testRunnerProcess.run(currentFileName);
  }

  cancelExecution() {
    this.hideExecutingIndicator();
    this.testRunnerProcess.cancelExecution();
  }

  renderAssert(assert) {
    let newTest = this.createElement('div', 'test');
    let status = (assert.ok) ? 'OK' : 'NO';
    newTest.textContent = `${status} - ${assert.name}`;
    this.testsContainer.appendChild(newTest);
  }

  renderFinalReport(results) {
    this.hideExecutingIndicator();

    let summary = this.createElement('div', 'summary');
    let percentage = Math.round((results.pass/results.count)*100);
    summary.textContent = `${results.count} total - ${percentage}% passed`;

    this.testsContainer.appendChild(summary);
  }

  createElement(elementType, cssClass = null) {
    let element = document.createElement(elementType);
    if (cssClass) {
      element.classList.add(cssClass);
    }
    return element;
  }

  displayExecutingIndicator() {
    this.executing.style.display = 'block';
  }

  hideExecutingIndicator() {
    this.executing.style.display = 'none';
  }

  serialize() { }

  destroy() {
    this.element.remove();
  }
}

module.exports = Panel;
