const test = require('node:test');
const assert = require('node:assert');
const app = require('../server');
const store = require('../store/userStore');

let server, base;

test.before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  base = `http://localhost:${server.address().port}`;
});

test.after(() => server.close());
test.beforeEach(() => store.clearUsers());

const post = (data) =>
  fetch(`${base}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(data).toString(),
  });

const good = {
  name: 'Test User',
  email: 'test@example.com',
  phone: '9123456789',
  age: '25',
  password: 'Valid@123',
  confirmPassword: 'Valid@123',
};

test('GET / returns the form', async () => {
  const res = await fetch(base + '/');
  assert.strictEqual(res.status, 200);
  assert.match(await res.text(), /User Registration/);
});

test('POST /register with valid data -> 201 + success message', async () => {
  const res = await post(good);
  assert.strictEqual(res.status, 201);
  assert.match(await res.text(), /Registration completed/);
});

test('POST /register with invalid data -> 400 + error messages', async () => {
  const res = await post({ ...good, email: 'bad', phone: '1' });
  assert.strictEqual(res.status, 400);
  const html = await res.text();
  assert.match(html, /Registration failed/);
  assert.match(html, /valid email/);
  assert.match(html, /10-digit/);
});

test('duplicate email -> 400', async () => {
  await post(good);
  const res = await post(good);
  assert.strictEqual(res.status, 400);
  assert.match(await res.text(), /already registered/);
});

test('HTML is escaped (XSS attempt)', async () => {
  const res = await post({ ...good, name: '<script>alert(1)</script>' });
  assert.strictEqual(res.status, 400);
  assert.doesNotMatch(await res.text(), /<script>alert/);
});

test('unknown route -> 404', async () => {
  const res = await fetch(base + '/nope');
  assert.strictEqual(res.status, 404);
});
