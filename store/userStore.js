// Module: simple in-memory data store
const users = [];

function addUser(user) {
  const record = {
    id: users.length + 1,
    name: user.name,
    email: user.email,
    phone: user.phone,
    age: Number(user.age),
    registeredAt: new Date().toLocaleString('en-IN'),
  };
  users.push(record); // password is intentionally NOT stored in plain text
  return record;
}

const getUsers = () => users.slice();
const getEmails = () => users.map((u) => u.email);
const clearUsers = () => { users.length = 0; };

module.exports = { addUser, getUsers, getEmails, clearUsers };
