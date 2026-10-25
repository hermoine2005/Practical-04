// Entry point: Express server setup
const path = require('path');
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const view = require('./views/render');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware: parse HTML form bodies (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: false, limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Simple request logger middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()}  ${req.method} ${req.url}`);
  next();
});

app.use('/', userRoutes);

// 404 handler
app.use((req, res) => res.status(404).send(view.notFoundPage()));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('<h1>500 - Internal Server Error</h1>');
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
}

module.exports = app;
