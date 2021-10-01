require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async() => {
      execSync('npm run setup-db');
  
      await client.connect();
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
    }, 10000);
  
    afterAll(done => {
      return client.end(done);
    });

    // Get All
    test('returns films', async() => {

      const expectation = [
        { id: 1,
          owner_id:1,
          title: 'Castle in the Sky',
          original_title_romanised: 'Tenkū no shiro Rapyuta',
          description: 'The orphan Sheeta inherited a mysterious crystal that links her to the mythical sky-kingdom of Laputa. With the help of resourceful Pazu and a rollicking band of sky pirates, she makes her way to the ruins of the once-great civilization. Sheeta and Pazu must outwit the evil Muska, who plans to use Laputa\'s science to make himself ruler of the world.',
          director: 'Hayao Miyazaki',
          producer: 'Isao Takahata',
          release_date: 1986,
          running_time: 124,
          rt_score: 95,
          img: 'https://resizing.flixster.com/jbMllx6WpeZxWEOJvx8utnodafM=/206x305/v2/https://flxt.tmsimg.com/NowShowing/20503/20503_aa.jpg',
          miyazaki: true,
          category: 'film'
        },
        { id: 2,
          owner_id: 1,
          title: 'Grave of the Fireflies',
          original_title_romanised: 'Hotaru no haka',
          description: 'In the latter part of World War II, a boy and his sister, orphaned when their mother is killed in the firebombing of Tokyo, are left to survive on their own in what remains of civilian life in Japan. The plot follows this boy and his sister as they do their best to survive in the Japanese countryside, battling hunger, prejudice, and pride in their own quiet, personal battle.',
          director: 'Isao Takahata',
          producer: 'Toru Hara',
          release_date: 1988,
          running_time: 89,
          rt_score: 97,
          img: 'https://resizing.flixster.com/Gvnl3dC2RcV6So3qnZ0Z1cbDVMg=/206x305/v2/https://flxt.tmsimg.com/assets/p158931_p_v10_aa.jpg',
          miyazaki: false,
          category: 'film'
        },
        { id: 3,
          owner_id: 1,
          title: 'My Neighbor Totoro',
          original_title_romanised: 'Tonari no Totoro',
          description: 'Two sisters move to the country with their father in order to be closer to their hospitalized mother, and discover the surrounding trees are inhabited by Totoros, magical spirits of the forest. When the youngest runs away from home, the older sister seeks help from the spirits to find her.',
          director: 'Hayao Miyazaki',
          producer: 'Hayao Miyazaki',
          release_date: 1988,
          running_time: 86,
          rt_score: 93,
          img: 'https://resizing.flixster.com/zl240CPBBowAZfldk-8FaX4dGuw=/206x305/v2/https://flxt.tmsimg.com/NowShowing/120448/120448_aa.jpg',
          miyazaki: true,
          category: 'film'
        },
        { id: 4,
          owner_id: 1,
          title: 'Kiki\'s Delivery Service',
          original_title_romanised: 'Majo no takkyūbin',
          description: 'A young witch, on her mandatory year of independent life, finds fitting into a new community difficult while she supports herself by running an air courier service.',
          director: 'Hayao Miyazaki',
          producer: 'Hayao Miyazaki',
          release_date: 1989,
          running_time: 102,
          rt_score: 96,
          img: 'https://resizing.flixster.com/AJ-MLjKl3EoNPg9QeoYxPNNjIR8=/206x305/v2/https://resizing.flixster.com/GcW_2ZRRiHn7HbOM14sbXx1kzhM=/ems.ZW1zLXByZC1hc3NldHMvbW92aWVzLzI4ZDY2MTllLWQ5MzktNDVlNC04MWQ4LWVmODQ4ODZiYTRkMS53ZWJw',
          miyazaki: true,
          category: 'film'
        },
        { id: 5,
          owner_id: 1,
          title: 'Only Yesterday',
          original_title_romanised: 'Omoide poro poro',
          description: 'It’s 1982, and Taeko is 27 years old, unmarried, and has lived her whole life in Tokyo. She decides to visit her family in the countryside, and as the train travels through the night, memories flood back of her younger years: the first immature stirrings of romance, the onset of puberty, and the frustrations of math and boys. At the station she is met by young farmer Toshio, and the encounters with him begin to reconnect her to forgotten longings. In lyrical switches between the present and the past, Taeko contemplates the arc of her life, and wonders if she has been true to the dreams of her childhood self.',
          director: 'Isao Takahata',
          producer: 'Toshio Suzuki',
          release_date: 1991,
          running_time: 118,
          rt_score: 100,
          img: 'https://resizing.flixster.com/JlcY1vkDahvRzKHT2ceAI8fPw9o=/206x305/v2/https://resizing.flixster.com/-XQGThh0gQuxBcB6G14fPhZymhM=/ems.ZW1zLXByZC1hc3NldHMvbW92aWVzL2JlNWVkYTQ2LWVjN2EtNDE0ZS1hZjkzLTcxNzFmNzJhMTc3YS53ZWJw',
          miyazaki: false,
          category: 'film' 
        },
        { id: 6,
          owner_id: 1,
          title: 'Porco Rosso',
          original_title_romanised: 'Kurenai no buta',
          description: 'Porco Rosso, known in Japan as Crimson Pig (Kurenai no Buta) is the sixth animated film by Hayao Miyazaki and released in 1992. You\'re introduced to an Italian World War I fighter ace, now living as a freelance bounty hunter chasing \'air pirates\' in the Adriatic Sea. He has been given a curse that changed his head to that of a pig. Once called Marco Pagot, he is now known to the world as \'Porco Rosso\', Italian for \'Red Pig.\'',
          director: 'Hayao Miyazaki',
          producer: 'Toshio Suzuki',
          release_date: 1992,
          running_time: 93,
          rt_score: 94,
          img: 'https://resizing.flixster.com/etAuWF5FCuSeKDL5FWh8PUnCpjo=/206x305/v2/https://flxt.tmsimg.com/assets/p160147_p_v10_ab.jpg',
          miyazaki: true,
          category: 'film'
        }
      ];
      
      const data = await fakeRequest(app)
        .get('/films')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });


    //Get By ID
    test('returns single film by id', async() => {

      const expectation = { 
        id: 1,
        owner_id:1,
        title: 'Castle in the Sky',
        original_title_romanised: 'Tenkū no shiro Rapyuta',
        description: 'The orphan Sheeta inherited a mysterious crystal that links her to the mythical sky-kingdom of Laputa. With the help of resourceful Pazu and a rollicking band of sky pirates, she makes her way to the ruins of the once-great civilization. Sheeta and Pazu must outwit the evil Muska, who plans to use Laputa\'s science to make himself ruler of the world.',
        director: 'Hayao Miyazaki',
        producer: 'Isao Takahata',
        release_date: 1986,
        running_time: 124,
        rt_score: 95,
        img: 'https://resizing.flixster.com/jbMllx6WpeZxWEOJvx8utnodafM=/206x305/v2/https://flxt.tmsimg.com/NowShowing/20503/20503_aa.jpg',
        miyazaki: true,
        category: 'film'
      };


      const data = await fakeRequest(app)
        .get('/films/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });


    // Post 
    test('Posts an item', async() => {
      const expectation = {
        id:expect.any(Number),
        owner_id: 1,
        title: 'Castle in the Sky',
        original_title_romanised: 'Tenkū no shiro Rapyuta',
        description: 'The orphan Sheeta inherited a mysterious crystal that links her to the mythical sky-kingdom of Laputa. With the help of resourceful Pazu and a rollicking band of sky pirates, she makes her way to the ruins of the once-great civilization. Sheeta and Pazu must outwit the evil Muska, who plans to use Laputa\'s science to make himself ruler of the world.',
        director: 'Hayao Miyazaki',
        producer: 'Isao Takahata',
        release_date: 1986,
        running_time: 124,
        rt_score: 95,
        img: 'https://resizing.flixster.com/jbMllx6WpeZxWEOJvx8utnodafM=/206x305/v2/https://flxt.tmsimg.com/NowShowing/20503/20503_aa.jpg',
        miyazaki: true,
        category: 'film'
      };

      const data = await fakeRequest(app)
        .post('/films')
        .send({
          owner_id: 1,
          title: 'Castle in the Sky',
          original_title_romanised: 'Tenkū no shiro Rapyuta',
          description: 'The orphan Sheeta inherited a mysterious crystal that links her to the mythical sky-kingdom of Laputa. With the help of resourceful Pazu and a rollicking band of sky pirates, she makes her way to the ruins of the once-great civilization. Sheeta and Pazu must outwit the evil Muska, who plans to use Laputa\'s science to make himself ruler of the world.',
          director: 'Hayao Miyazaki',
          producer: 'Isao Takahata',
          release_date: 1986,
          running_time: 124,
          rt_score: 95,
          img: 'https://resizing.flixster.com/jbMllx6WpeZxWEOJvx8utnodafM=/206x305/v2/https://flxt.tmsimg.com/NowShowing/20503/20503_aa.jpg',
          miyazaki: true,
          category: 'film'
        });
      expect(200);

      expect(data.body).toEqual(expectation);
    });


    // Delete
    test('Deletes an item', async() => {
      const expectation = {
        id:1,
        owner_id: 1,
        title: 'Castle in the Sky',
        original_title_romanised: 'Tenkū no shiro Rapyuta',
        description: 'The orphan Sheeta inherited a mysterious crystal that links her to the mythical sky-kingdom of Laputa. With the help of resourceful Pazu and a rollicking band of sky pirates, she makes her way to the ruins of the once-great civilization. Sheeta and Pazu must outwit the evil Muska, who plans to use Laputa\'s science to make himself ruler of the world.',
        director: 'Hayao Miyazaki',
        producer: 'Isao Takahata',
        release_date: 1986,
        running_time: 124,
        rt_score: 95,
        img: 'https://resizing.flixster.com/jbMllx6WpeZxWEOJvx8utnodafM=/206x305/v2/https://flxt.tmsimg.com/NowShowing/20503/20503_aa.jpg',
        miyazaki: true,
        category: 'film'
      };

      const data = await fakeRequest(app)
        .delete('/films/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual('');

      const films = await fakeRequest(app)
        .get ('/films');
      
      expect(films.body).toEqual(expect.not.arrayContaining([expectation]));    
    });
  });
});
