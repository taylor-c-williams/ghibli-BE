const client = require('../lib/client');
// import our seed data:
const films = require('./films.js');
const creators = require ('./creators.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    const users2 = await Promise.all(
      usersData.map(users => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [users.email, users.hash]);
      })
    );
      
    const user = users2[0].rows[0];

    await Promise.all(
      creators.map(creators => {
        return client.query(`
                      INSERT INTO creators (director, producer)
                      VALUES ($1, $2);
                  `,
        [creators.director, creators.producer]);
      })
    );

    await Promise.all(
      films.map(film => {
        return client.query(`
                    INSERT INTO films (title, original_title_romanised, description, release_date, running_time, rt_score, img, miyazaki, category, owner_id, creators_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
                `,
        [film.title, film.original_title_romanised, film.description, film.release_date, film.running_time, film.rt_score, film.img, film.miyazaki, film.category, film.owner_id, user.id]);
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
