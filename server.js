const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const FILE_PATH = 'tasks.txt';

// Add single task 
app.post('/add-task', (req, res) => {
  const task = req.body;
  const line = JSON.stringify(task) + '\n';
  fs.appendFile(FILE_PATH, line, err => {
    if (err) return res.status(500).send('Error saving task');
    res.send('Task saved');
  });
});

// Save all tasks (used for updating, deleting, etc.)
app.post('/save-tasks', (req, res) => {
  const tasks = req.body;

  if (!Array.isArray(tasks)) {
    return res.status(400).json({ error: 'Invalid tasks data' });
  }

  const lines = tasks.map(task => JSON.stringify(task)).join('\n');
  fs.writeFile(FILE_PATH, lines + '\n', err => {
    if (err) return res.status(500).json({ error: 'Failed to save tasks' });
    res.json({ status: 'updated' });
  });
});

// Fetch tasks
app.get('/get-tasks', (req, res) => {
  fs.readFile(FILE_PATH, 'utf8', (err, data) => {
    if (err || !data.trim()) return res.json([]);
    const lines = data.trim().split('\n');
    const tasks = lines.map(line => JSON.parse(line));
    res.json(tasks);
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
