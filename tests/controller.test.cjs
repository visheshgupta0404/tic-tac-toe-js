const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const TicTacToe = require('../game');
function page() {
  const element = () => ({ events: {}, textContent: '', disabled: false, checked: true, dataset: {},
    classList: { toggle() {} }, setAttribute() {}, focus() {},
    addEventListener(name, callback) { this.events[name] = callback; } });
  const cells = Array.from({length:9}, element);
  const elements = Object.fromEntries(['result','auto-restart','restart','score-x','score-o','score-draws'].map(id=>[id,element()]));
  const timers = new Map(); let id = 0;
  vm.runInNewContext(fs.readFileSync(require.resolve('../script.js'),'utf8'), {
    document: { querySelectorAll: () => cells, getElementById: id => elements[id] }, TicTacToe,
    setTimeout: fn => { timers.set(++id,fn); return id; }, clearTimeout: id => timers.delete(id),
  });
  return { cells, elements, timers, win: () => [0,3,1,4,2].forEach(i=>cells[i].events.click()) };
}
test('winning locks cells, scores once, and manual restart cancels pending timeout', () => {
  const { cells, elements, timers, win } = page(); win();
  assert.equal(elements['score-x'].textContent, 1);
  assert.ok(cells.every(c=>c.disabled));
  cells[5].events.click();
  assert.equal(elements['score-x'].textContent, 1);
  assert.equal(timers.size, 1);
  elements.restart.events.click();
  assert.equal(timers.size, 0);
  assert.ok(cells.every(c=>!c.disabled && c.textContent === ''));
  cells[0].events.click(); assert.equal(cells[0].textContent,'X');
});
test('turning off auto restart cancels the timer and retains the winning board', () => {
  const { cells, elements, timers, win } = page(); win();
  elements['auto-restart'].checked = false;
  elements['auto-restart'].events.change();
  assert.equal(timers.size, 0);
  assert.equal(elements.result.textContent, 'X wins!');
  assert.equal(cells[0].textContent, 'X');
});
test('automatic restart resets only the board and preserves scores', () => {
  const { cells, elements, timers, win } = page(); win();
  [...timers.values()][0]();
  assert.ok(cells.every(c=>c.textContent === ''));
  assert.equal(elements['score-x'].textContent, 1);
  assert.equal(elements.result.textContent, "X's turn");
});
