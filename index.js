const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON request body

// Połączenie z MongoDB
mongoose.connect('mongodb://mongo:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });

// Definicja schematu dla kolekcji 'humanitas'
const HumanitasSchema = new mongoose.Schema({
  name: String,
  age: Number,
  occupation: String
});

// Model dla schematu 'Humanitas'
const Humanitas = mongoose.model('Humanitas', HumanitasSchema);

// Endpoint GET, który sprawdza zawartość kolekcji 'humanitas'
app.get('/app', async (req, res) => {
  try {
    const result = await Humanitas.find();
    if (result.length > 0) {
      res.json(result);  // Wyświetla dokumenty, jeśli kolekcja nie jest pusta
    } else {
      res.send('No documents found in the humanitas collection');
    }
  } catch (error) {
    res.status(500).send('Error accessing the humanitas collection: ' + error.message);
  }
});

// Endpoint POST, aby dodać nowy dokument do kolekcji 'humanitas'
app.post('/app/add', async (req, res) => {
  try {
    const newEntry = new Humanitas({
      name: req.body.name || "Anna Nowak",
      age: req.body.age || null,
      occupation: req.body.occupation || null
    });

    const savedEntry = await newEntry.save();
    res.json({ message: 'Document inserted successfully', data: savedEntry });
  } catch (error) {
    res.status(500).send('Error inserting document: ' + error.message);
  }
});

// Nasłuchiwanie na zdefiniowanym porcie
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
