const { test } = require('node:test');
const assert = require('node:assert/strict');
const { newGame, play } = require('../game');
const moves = indices => indices.reduce(play, newGame());
test('X starts, turns alternate, and occupied or invalid squares do not consume a turn', () => {
  const first = play(newGame(), 0);
  assert.equal(first.board[0], 'X');
  assert.equal(first.turn, 'O');
  for (const index of [0, -1, 9, NaN, 0.5, '1']) assert.equal(play(first, index), first);
  assert.equal(play(first, 1).board[1], 'O');
});
test('a completed win locks all remaining squares', () => {
  const state = moves([0,3,1,4,2]);
  assert.equal(state.winner, 'X');
  assert.deepEqual(state.winningLine, [0,1,2]);
  assert.equal(play(state, 5), state);
});
test('draw is terminal, while a ninth-move win is still a win', () => {
  const draw = moves([0,1,2,4,3,5,7,6,8]);
  assert.equal(draw.draw, true);
  assert.equal(draw.winner, null);
  assert.equal(play(draw, 0), draw);
  const win = moves([0,1,2,3,4,5,7,6,8]);
  assert.equal(win.winner, 'X');
  assert.equal(win.draw, false);
});
test('moves do not mutate earlier boards and new rounds start empty', () => {
  const old = newGame(); play(old, 0);
  assert.ok(old.board.every(value => value === null));
  assert.deepEqual(newGame(), old);
});
test('all reachable games end at the first win/draw and preserve legal turn counts', () => {
  let terminal = 0;
  function walk(state) {
    const x = state.board.filter(v => v === 'X').length;
    const o = state.board.filter(v => v === 'O').length;
    assert.ok(x === o || x === o + 1);
    if (state.winner || state.draw) {
      terminal++;
      for (let i=0;i<9;i++) assert.equal(play(state,i),state);
      return;
    }
    assert.equal(state.turn, x === o ? 'X' : 'O');
    for (let i=0;i<9;i++) if (!state.board[i]) walk(play(state,i));
  }
  walk(newGame());
  assert.equal(terminal, 255168);
});
