const fs = require("fs");
const path = require("path");

exports.seed = async function (knex) {
  // Read JSON file
  const dataPath = path.join(__dirname, "../../imdb_clone_seeder.json");
  const seedData = JSON.parse(fs.readFileSync(dataPath, "utf8"));

  // Clear tables
  await knex("movie_actors").del();
  await knex("movies").del();
  await knex("producers").del();
  await knex("actors").del();
  await knex("users").del();

  const producerIdMap = {};
  const actorIdMap = {};

  // 1. Users
  if (seedData.users && seedData.users.length > 0) {
    const usersToInsert = seedData.users.map((u, i) => ({
      id: i + 1,
      name: u.name,
      email: u.email,
      password: u.password,
      role: u.role,
      created_at: new Date(u.createdAt),
      updated_at: new Date(u.updatedAt),
    }));
    await knex("users").insert(usersToInsert);
    console.log(`✅ Seeded ${usersToInsert.length} users`);
  }

  // 2. Producers
  if (seedData.producers && seedData.producers.length > 0) {
    const producersToInsert = seedData.producers.map((p, i) => {
      const newId = i + 1;
      producerIdMap[p._id] = newId;
      return {
        id: newId,
        name: p.name,
        gender: p.gender,
        dob: new Date(p.dob),
        bio: p.bio,
        image: p.image || null,
        created_at: new Date(p.createdAt),
        updated_at: new Date(p.updatedAt),
      };
    });
    await knex("producers").insert(producersToInsert);
    console.log(`✅ Seeded ${producersToInsert.length} producers`);
  }

  // 3. Actors
  if (seedData.actors && seedData.actors.length > 0) {
    const actorsToInsert = seedData.actors.map((a, i) => {
      const newId = i + 1;
      actorIdMap[a._id] = newId;
      return {
        id: newId,
        name: a.name,
        gender: a.gender,
        dob: new Date(a.dob),
        bio: a.bio,
        image: a.image || null,
        created_at: new Date(a.createdAt),
        updated_at: new Date(a.updatedAt),
      };
    });
    await knex("actors").insert(actorsToInsert);
    console.log(`✅ Seeded ${actorsToInsert.length} actors`);
  }

  // 4. Movies & Movie_Actors
  if (seedData.movies && seedData.movies.length > 0) {
    const moviesToInsert = [];
    const movieActorsToInsert = [];

    seedData.movies.forEach((m, i) => {
      const movieId = i + 1;
      moviesToInsert.push({
        id: movieId,
        name: m.name,
        yearOfRelease: m.yearOfRelease,
        plot: m.plot,
        poster: m.poster || null,
        producer_id: producerIdMap[m.producer] || null,
        created_at: new Date(m.createdAt),
        updated_at: new Date(m.updatedAt),
      });

      if (m.actors && Array.isArray(m.actors)) {
        m.actors.forEach((actorIdString) => {
          const actorId = actorIdMap[actorIdString];
          if (actorId) {
            movieActorsToInsert.push({
              movie_id: movieId,
              actor_id: actorId,
            });
          }
        });
      }
    });

    await knex("movies").insert(moviesToInsert);
    console.log(`✅ Seeded ${moviesToInsert.length} movies`);

    if (movieActorsToInsert.length > 0) {
      await knex("movie_actors").insert(movieActorsToInsert);
      console.log(
        `✅ Seeded ${movieActorsToInsert.length} movie_actors relations`,
      );
    }
  }
};
