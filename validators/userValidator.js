// Module: server-side validation logic (no dependency on Express, easy to test)

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_REGEX = /^[6-9]\d{9}$/; // Indian 10-digit mobile number
const NAME_REGEX = /^[A-Za-z][A-Za-z\s.'-]*$/;

function clean(body = {}) {
  const trim = (v) => (typeof v === 'string' ? v.trim() : '');
  return {
    name: trim(body.name),
    email: trim(body.email).toLowerCase(),
    phone: trim(body.phone),
    age: trim(body.age),
    password: typeof body.password === 'string' ? body.password : '',
    confirmPassword:
      typeof body.confirmPassword === 'string' ? body.confirmPassword : '',
  };
}

function validateUser(body, existingEmails = []) {
  const data = clean(body);
  const errors = {};

  // Name
  if (!data.name) errors.name = 'Name is required.';
  else if (data.name.length < 3 || data.name.length > 50)
    errors.name = 'Name must be between 3 and 50 characters.';
  else if (!NAME_REGEX.test(data.name))
    errors.name = 'Name may contain only letters, spaces, . \' and -.';

  // Email
  if (!data.email) errors.email = 'Email is required.';
  else if (!EMAIL_REGEX.test(data.email))
    errors.email = 'Enter a valid email address (e.g. name@example.com).';
  else if (existingEmails.includes(data.email))
    errors.email = 'This email is already registered.';

  // Phone
  if (!data.phone) errors.phone = 'Phone number is required.';
  else if (!PHONE_REGEX.test(data.phone))
    errors.phone = 'Phone must be a 10-digit number starting with 6-9.';

  // Age
  if (!data.age) errors.age = 'Age is required.';
  else if (!/^\d+$/.test(data.age)) errors.age = 'Age must be a whole number.';
  else if (Number(data.age) < 18 || Number(data.age) > 100)
    errors.age = 'Age must be between 18 and 100.';

  // Password
  if (!data.password) errors.password = 'Password is required.';
  else if (data.password.length < 8)
    errors.password = 'Password must be at least 8 characters long.';
  else if (!/[A-Z]/.test(data.password))
    errors.password = 'Password must contain an uppercase letter.';
  else if (!/[a-z]/.test(data.password))
    errors.password = 'Password must contain a lowercase letter.';
  else if (!/\d/.test(data.password))
    errors.password = 'Password must contain a digit.';
  else if (!/[^A-Za-z0-9]/.test(data.password))
    errors.password = 'Password must contain a special character.';

  // Confirm password
  if (!data.confirmPassword)
    errors.confirmPassword = 'Please confirm your password.';
  else if (data.password !== data.confirmPassword)
    errors.confirmPassword = 'Passwords do not match.';

  return { valid: Object.keys(errors).length === 0, errors, data };
}

module.exports = { validateUser };
