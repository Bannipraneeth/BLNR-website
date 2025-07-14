const { spawn } = require('child_process');
const path = require('path');

// Start MongoDB (if not already running)
const mongod = spawn('mongod', ['--dbpath', path.join(__dirname, 'data', 'db')], {
  stdio: 'inherit'
});

mongod.on('error', (err) => {
  console.error('Failed to start MongoDB:', err);
});

// Start the server
const server = spawn('node', ['server.js'], {
  stdio: 'inherit'
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
});

// Handle process termination
process.on('SIGINT', () => {
  mongod.kill();
  server.kill();
  process.exit();
}); 