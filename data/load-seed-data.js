const client = require('../lib/client');
// import our seed data:
const details = require('./details.js');
const films = require('./films.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {
  
  try {
    await client.connect();
    
    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
        INSERT INTO users (email, hash)
        VALUES ($1, $2)
        RETURNING *;
        `,
        [user.email, user.hash]);
      })
    );      

    const user = users[0].rows[0];

    await Promise.all(
      details.map(details => {
        return client.query(`
          INSERT INTO details (release_date, running_time, rt_score, miyazaki, category)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *;
          `,
        [details.release_date, details.running_time, details.rt_score, details.miyazaki, details.category]);
      })
    );

    await Promise.all(
      films.map(film => {
        return client.query(`
          INSERT INTO films (title, original_title_romanised, description, director, producer, img, owner_id, details_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING *;
          `,
        [film.title, film.original_title_romanised, film.description, film.director, film.producer, film.img, users.id, details.id]);
      })
    );
        
    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
      
}
