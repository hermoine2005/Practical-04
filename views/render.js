// Module: HTML rendering helpers (no template engine needed)
function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function layout(title, body) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <header>
    <h1>Server-Side Validation Demo</h1>
    <nav><a href="/">Register</a><a href="/users">Registered Users</a></nav>
  </header>
  <main>${body}</main>
  <footer>Practical No. 04 &middot; NodeJS + Express</footer>
</body>
</html>`;
}

function field(label, name, type, values, errors, extra = '') {
  const err = errors[name];
  const val = type === 'password' ? '' : values[name] || '';
  return `<div class="field${err ? ' has-error' : ''}">
    <label for="${name}">${label}</label>
    <input id="${name}" name="${name}" type="${type}" value="${esc(val)}" ${extra}>
    ${err ? `<p class="error-text">${esc(err)}</p>` : ''}
  </div>`;
}

function formPage(values = {}, errors = {}) {
  const count = Object.keys(errors).length;
  const banner = count
    ? `<div class="alert error"><strong>Registration failed.</strong> Please fix ${count} error${count > 1 ? 's' : ''} below.</div>`
    : '';
  const body = `<h2>User Registration</h2>
  ${banner}
  <form method="POST" action="/register" novalidate>
    ${field('Full Name', 'name', 'text', values, errors)}
    ${field('Email', 'email', 'email', values, errors)}
    ${field('Phone (10 digits)', 'phone', 'text', values, errors)}
    ${field('Age', 'age', 'text', values, errors)}
    ${field('Password', 'password', 'password', values, errors)}
    ${field('Confirm Password', 'confirmPassword', 'password', values, errors)}
    <button type="submit">Register</button>
  </form>
  <p class="hint">Note: <code>novalidate</code> is used on purpose so that all checks are done by the <strong>server</strong>.</p>`;
  return layout('Register', body);
}

function successPage(user) {
  const body = `<div class="alert success"><strong>Success!</strong> Registration completed.</div>
  <table>
    <tr><th>ID</th><td>${esc(user.id)}</td></tr>
    <tr><th>Name</th><td>${esc(user.name)}</td></tr>
    <tr><th>Email</th><td>${esc(user.email)}</td></tr>
    <tr><th>Phone</th><td>${esc(user.phone)}</td></tr>
    <tr><th>Age</th><td>${esc(user.age)}</td></tr>
    <tr><th>Registered At</th><td>${esc(user.registeredAt)}</td></tr>
  </table>
  <p><a class="btn" href="/">Register another user</a> <a class="btn" href="/users">View all users</a></p>`;
  return layout('Success', body);
}

function usersPage(users) {
  const rows = users.length
    ? users.map((u) => `<tr><td>${esc(u.id)}</td><td>${esc(u.name)}</td><td>${esc(u.email)}</td><td>${esc(u.phone)}</td><td>${esc(u.age)}</td></tr>`).join('')
    : '<tr><td colspan="5">No users registered yet.</td></tr>';
  const body = `<h2>Registered Users (${users.length})</h2>
  <table class="list"><thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Age</th></tr></thead><tbody>${rows}</tbody></table>`;
  return layout('Users', body);
}

function notFoundPage() {
  return layout('404', '<div class="alert error"><strong>404</strong> - Page not found.</div><p><a class="btn" href="/">Go Home</a></p>');
}

module.exports = { formPage, successPage, usersPage, notFoundPage };
