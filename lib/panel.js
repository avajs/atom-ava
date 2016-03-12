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
    this.toggleExecutingIndicator();
    this.testsContainer.innerHTML = '';
    let editor = atom.workspace.getActiveTextEditor();
    let currentFileName = editor.buffer.file.path;
    this.testRunnerProcess.run(currentFileName);
  }

  cancelExecution() {
    this.testRunnerProcess.cancelExecution();
  }

  renderAssert(assert) {
    let newTest = this.createElement('div', 'test');
    let status = (assert.ok) ? 'OK' : 'NO';
    newTest.textContent = `${status} - ${assert.name}`;
    this.testsContainer.appendChild(newTest);
  }

  renderFinalReport(results) {
    this.toggleExecutingIndicator();

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

  toggleExecutingIndicator() {
    this.executing.style.display =
      (this.executing.style.display === 'block') ? 'none' : 'block';
  }

  serialize() { }

  destroy() {
    this.element.remove();
  }
}

module.exports = Panel;
