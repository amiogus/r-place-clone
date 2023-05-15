const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/rplace', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const pixelSchema = new mongoose.Schema({
  x: Number,
  y: Number,
  color: String,
});

const Pixel = mongoose.model('Pixel', pixelSchema);

app.get('/pixels', async (req, res) => {
  const pixels = await Pixel.find();
  res.send(pixels);
});

app.post('/place', async (req, res) => {
  const { x, y, color } = req.body;
  const existingPixel = await Pixel.findOne({ x, y });
  if (existingPixel) {
    existingPixel.color = color;
    await existingPixel.save();
  } else {
    const pixel = new Pixel({ x, y, color });
    await pixel.save();
  }
  res.send({ message: 'Pixel placed successfully.' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});
