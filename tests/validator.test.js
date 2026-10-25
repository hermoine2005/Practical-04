const test = require('node:test');
const assert = require('node:assert');
const { validateUser } = require('../validators/userValidator');

const good = {
  name: 'Shruti Rachmale',
  email: 'Shruti@Example.com',
  phone: '9876543210',
  age: '21',
  password: 'Str0ng@Pass',
  confirmPassword: 'Str0ng@Pass',
};

test('valid input passes and email is lower-cased', () => {
  const r = validateUser(good);
  assert.strictEqual(r.valid, true);
  assert.strictEqual(r.data.email, 'shruti@example.com');
});

test('empty form reports every field', () => {
  const r = validateUser({});
  assert.strictEqual(r.valid, false);
  for (const f of ['name', 'email', 'phone', 'age', 'password', 'confirmPassword'])
    assert.ok(r.errors[f], `missing error for ${f}`);
});

test('invalid email rejected', () => {
  assert.ok(validateUser({ ...good, email: 'abc@' }).errors.email);
});

test('invalid phone rejected', () => {
  assert.ok(validateUser({ ...good, phone: '12345' }).errors.phone);
  assert.ok(validateUser({ ...good, phone: '5876543210' }).errors.phone);
});

test('age out of range / non-numeric rejected', () => {
  assert.ok(validateUser({ ...good, age: '15' }).errors.age);
  assert.ok(validateUser({ ...good, age: 'abc' }).errors.age);
});

test('weak password rejected', () => {
  assert.ok(validateUser({ ...good, password: 'short', confirmPassword: 'short' }).errors.password);
  assert.ok(validateUser({ ...good, password: 'alllowercase1!', confirmPassword: 'alllowercase1!' }).errors.password);
});

test('password mismatch rejected', () => {
  assert.ok(validateUser({ ...good, confirmPassword: 'Different@1' }).errors.confirmPassword);
});

test('duplicate email rejected', () => {
  assert.ok(validateUser(good, ['shruti@example.com']).errors.email);
});
