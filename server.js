const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const shortUrl = require('./models/shortUrl');

const app = express();
app.use(express.urlencoded({ extended: false }));

mongoose.connect('mongodb://localhost/urlShortner', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  try {
    const shortUrls = await ShortUrl.find();
    res.render('index', { shortUrls: shortUrls });
  } catch (error) {
    console.error('Error fetching short URLs:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/shortUrls', async (req, res) => {
  try {
    await ShortUrl.create({ full: req.body.fullUrl });
    res.redirect('/');
  } catch (error) {
    console.error('Error creating short URL:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/:shortUrl', async (req, res) => {
    try {
        const shortUrl = ShortUrl.findOne({short: req.params.shortUrl})
        if(shortUrl == null) return res.sendStatus(404);

        shortUrl.clicks++
        shortUrl.save();
        res.redirect(shortUrl.full)
      } catch (error) {
        console.error('Error finding :', error.message);
        res.status(500).send('Internal Server Error');
      }
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
