import { test } from 'node:test';
import assert from 'node:assert/strict';
import errorHandler from '../src/middleware/errorHandler.js';
import notFound from '../src/middleware/notFound.js';

// Minimal fake response object
const fakeRes = () => {
  const res = { statusCode: 200, body: null };
  res.status = (code) => ((res.statusCode = code), res);
  res.json = (body) => ((res.body = body), res);
  return res;
};

const run = (err) => {
  const res = fakeRes();
  const original = console.error;
  console.error = () => {}; // keep test output clean for expected 500s
  try {
    errorHandler(err, {}, res, () => {});
  } finally {
    console.error = original;
  }
  return res;
};

test('invalid JSON body → 400', () => {
  const res = run(Object.assign(new Error('x'), { type: 'entity.parse.failed' }));
  assert.equal(res.statusCode, 400);
  assert.match(res.body.message, /JSON/);
});

test('body too large → 413', () => {
  assert.equal(run(Object.assign(new Error('x'), { type: 'entity.too.large' })).statusCode, 413);
});

test('CORS rejection → 403', () => {
  assert.equal(run(new Error('Not allowed by CORS')).statusCode, 403);
});

test('Mongoose CastError → 400', () => {
  assert.equal(run(Object.assign(new Error('bad id'), { name: 'CastError' })).statusCode, 400);
});

test('unexpected error → 500, details hidden in production', () => {
  const previous = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  const res = run(new Error('secret db detail'));
  process.env.NODE_ENV = previous;
  assert.equal(res.statusCode, 500);
  assert.equal(res.body.message, 'Internal server error.');
});

test('notFound → 404 JSON', () => {
  const res = fakeRes();
  notFound({ method: 'GET', originalUrl: '/api/x' }, res);
  assert.equal(res.statusCode, 404);
  assert.equal(res.body.success, false);
});
