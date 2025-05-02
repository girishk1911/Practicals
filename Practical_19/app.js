const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/student', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB")).catch(err => console.error(err));

// Define Schema
const studentSchema = new mongoose.Schema({
  Name: String,
  Roll_No: Number,
  WAD_Marks: Number,
  CC_Marks: Number,
  DSBDA_Marks: Number,
  CNS_Marks: Number,
  AI_marks: Number
});

const Student = mongoose.model('studentmarks', studentSchema);

// c) Insert initial documents (insert once)
app.get('/insert', async (req, res) => {
  const data = [
    { Name: 'ABC', Roll_No: 111, WAD_Marks: 25, CC_Marks: 25, DSBDA_Marks: 25, CNS_Marks: 25, AI_marks: 25 },
    { Name: 'XYZ', Roll_No: 112, WAD_Marks: 10, CC_Marks: 35, DSBDA_Marks: 22, CNS_Marks: 45, AI_marks: 30 },
    { Name: 'PQR', Roll_No: 113, WAD_Marks: 30, CC_Marks: 30, DSBDA_Marks: 15, CNS_Marks: 20, AI_marks: 25 },
    { Name: 'MNO', Roll_No: 114, WAD_Marks: 40, CC_Marks: 45, DSBDA_Marks: 27, CNS_Marks: 30, AI_marks: 28 },
  ];
  await Student.insertMany(data);
  res.send("Documents inserted.");
});

// d) Count and list all documents
app.get('/all', async (req, res) => {
  const count = await Student.countDocuments();
  const students = await Student.find();
  res.send(`<h2>Total Documents: ${count}</h2><pre>${JSON.stringify(students, null, 2)}</pre>`);
});

// e) Students with DSBDA > 20
app.get('/dsbda', async (req, res) => {
  const students = await Student.find({ DSBDA_Marks: { $gt: 20 } });
  const names = students.map(s => s.Name).join(', ');
  res.send(`Students with DSBDA > 20: ${names}`);
});

// f) Update marks of specified student (by name query param)
app.get('/update/:name', async (req, res) => {
  const name = req.params.name;
  await Student.updateOne({ Name: name }, {
    $inc: {
      WAD_Marks: 10,
      CC_Marks: 10,
      DSBDA_Marks: 10,
      CNS_Marks: 10,
      AI_marks: 10
    }
  });
  res.send(`Marks updated for ${name}`);
});

// g) Students with >25 in all subjects
app.get('/all25', async (req, res) => {
  const students = await Student.find({
    WAD_Marks: { $gt: 25 },
    CC_Marks: { $gt: 25 },
    DSBDA_Marks: { $gt: 25 },
    CNS_Marks: { $gt: 25 },
    AI_marks: { $gt: 25 }
  });
  const names = students.map(s => s.Name).join(', ');
  res.send(`Students with >25 in all subjects: ${names}`);
});

// h) Students with <40 in both WAD (Maths) and CNS (Science)
app.get('/less40', async (req, res) => {
  const students = await Student.find({
    WAD_Marks: { $lt: 40 },
    CNS_Marks: { $lt: 40 }
  });
  const names = students.map(s => s.Name).join(', ');
  res.send(`Students with <40 in WAD & CNS: ${names}`);
});

// i) Remove student by name
app.get('/delete/:name', async (req, res) => {
  const name = req.params.name;
  await Student.deleteOne({ Name: name });
  res.send(`Deleted student ${name}`);
});

// j) Display in tabular format
app.get('/table', async (req, res) => {
  const students = await Student.find();
  res.render('table', { students });
});

app.get('/', (req, res) => {
    res.send(`
      <h1>Welcome to Student Marks App</h1>
      <ul>
        <li><a href="/insert">Insert Documents</a></li>
        <li><a href="/all">View All Documents & Count</a></li>
        <li><a href="/dsbda">Students with DSBDA > 20</a></li>
        <li><a href="/update/ABC">Update Marks for ABC</a></li>
        <li><a href="/all25">Students with >25 Marks in All Subjects</a></li>
        <li><a href="/less40">Students with <40 in WAD & CNS</a></li>
        <li><a href="/delete/XYZ">Delete Student XYZ</a></li>
        <li><a href="/table">Display All Students in Table</a></li>
      </ul>
    `);
  });
  
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  
