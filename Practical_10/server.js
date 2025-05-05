const express = require('express');
const app = express();
const tasks = [];
app.use(express.static(__dirname));
app.use(express.json());

app.get('/tasks', (req, res) => res.json(tasks));
app.post('/tasks', (req, res) => { tasks.push(req.body.task); res.sendStatus(200); });
app.put('/tasks/:i', (req, res) => { tasks[req.params.i] = req.body.task; res.sendStatus(200); });
app.delete('/tasks/:i', (req, res) => { tasks.splice(req.params.i, 1); res.sendStatus(200); });

app.listen(3000, () => console.log('Server running at http://localhost:3000')); 