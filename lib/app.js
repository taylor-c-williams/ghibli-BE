const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');
 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this protected route, we get the user's id like so: ${req.userId}`
  });
});

// Get all
app.get('/films', async(req, res) => {
  try {
    const data = await client.query(`SELECT
    films.id,
    title,
    original_title_romanised,
    description,
    director,
    producer,
    release_date,
    running_time,
    rt_score,
    img,
    miyazaki,
    owner_id,
    category_id,
    categories.category
    FROM films
    JOIN categories
    ON films.category_id = categories.id`);   
    res.json(data.rows);
  } catch(e) {    
    res.status(500).json({ error: e.message });
  }
});

// Get Categories
app.get('/categories', async(req, res) => {
  try {
    const data = await client.query('SELECT * from categories');    
    res.json(data.rows);
  } catch(e) {    
    res.status(500).json({ error: e.message });
  }
});

// Get one
app.get('/films/:id', async(req, res) => {
  try {
    const data = await client.query(`SELECT
    films.id,
    title,
    original_title_romanised,
    description,
    director,
    producer,
    release_date,
    running_time,
    rt_score,
    img,
    miyazaki,
    owner_id,
    category_id,
    categories.category
    FROM films
    JOIN categories
    ON films.category_id = categories.id where films.id=$1`, [req.params.id]);    
    res.json(data.rows[0]);
  } catch(e) {    
    res.status(500).json({ error: e.message });
  }
});

// Post Films
app.post('/films', async(req, res) => {
  try {
    const data = await client.query(
      `INSERT INTO films (title, original_title_romanised, description, director, producer, release_date, running_time, rt_score, img, miyazaki, category, owner_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
       `, [req.body.title, req.body.original_title_romanised, req.body.description, req.body.director, req.body.producer, req.body.release_date, req.body.running_time, req.body.rt_score, req.body.img, req.body.miyazaki, req.body.category_id, req.body.owner_id
      ]);
    
    res.json(data.rows[0]);
  } catch(e) {    
    res.status(500).json({ error: e.message });
  }
});

//Post Categories
app.post('/categories', async(req, res) => {
  try {
    const data = await client.query(
      `INSERT INTO categories (category)
      VALUES ($1)
      RETURNING *
       `,
      [req.body.category]);    
    res.json(data.rows[0]);
  } catch(e) {    
    res.status(500).json({ error: e.message });
  }
});

// Put 
app.put('/films/:id', async(req, res) => {
  try {
    const data = await client.query(`
    UPDATE films
     SET title = $1, original_title_romanised = $2,  description = $3, director = $4, producer  = $5, release_date = $6, running_time = $7, rt_score = $8, img = $9, miyazaki = $10, category= $11
     WHERE id = $12;`,
    [req.body.title, req.body.original_title_romanised, req.body.description, req.body.director, req.body.producer, req.body.release_date, req.body.running_time, req.body.rt_score, req.body.img, req.body.miyazaki, req.body.category, req.body.owner_id]);    
    res.json(data.rows);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete
app.delete('/films/:id', async(req, res) => {
  try {
    const data = await client.query(`
    DELETE from films WHERE id=$1`, [req.params.id]);
    res.json(data.rows[0]);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.use(require('./middleware/error'));

module.exports = app;
