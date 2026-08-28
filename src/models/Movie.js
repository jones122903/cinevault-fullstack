const db = require("../../database/db");

const Movie = {
  async _attachRelations(movie) {
    if (!movie) return null;

    await new Promise((resolve) => setTimeout(resolve, 25));

    // Fetch producer
    if (movie.producer_id) {
      movie.producer = await db("producers")
        .where({ id: movie.producer_id })
        .first();
    }

    // Fetch actors
    const actorIds = await db("movie_actors")
      .where({ movie_id: movie.id })
      .pluck("actor_id");
    if (actorIds.length > 0) {
      movie.actors = await db("actors").whereIn("id", actorIds);
    } else {
      movie.actors = [];
    }

    return movie;
  },

  async find(filter = {}, limit, offset) {
    let query = db("movies").whereNull("deleted_at");
    if (filter.name) {
      const nameVal = filter.name.$regex || filter.name;
      query = query.where("name", "like", `%${nameVal}%`);
    }

    if (limit) query = query.limit(limit);
    if (offset) query = query.offset(offset);

    const movies = await query.orderBy("created_at", "asc");

    return Promise.all(movies.map((movie) => this._attachRelations(movie)));
  },

  async findById(id) {
    const movie = await db("movies")
      .where({ id })
      .whereNull("deleted_at")
      .first();
    return this._attachRelations(movie);
  },

  async create(data) {
    const { actors, producer, ...movieData } = data;

    const trx = await db.transaction();

    if (producer) {
      movieData.producer_id = producer;
    }

    // Insert movie using trx
    const [movieId] = await trx("movies").insert(movieData);

    // Insert actors using trx
    if (actors && actors.length > 0) {
      const actorRelations = actors.map((actorId) => ({
        movie_id: movieId,
        actor_id: actorId,
      }));
      await trx("movie_actors").insert(actorRelations);
    }

    return this.findById(movieId);
  },

  async findByIdAndUpdate(id, data, options = {}) {
    const { actors, producer, ...movieData } = data;

    if (producer !== undefined) {
      movieData.producer_id = producer;
    }

    if (Object.keys(movieData).length > 0) {
      movieData.updated_at = db.fn.now();
      await db("movies").where({ id }).update(movieData);
    }

    if (actors !== undefined) {
      // Delete existing relations
      await db("movie_actors").where({ movie_id: id }).del();

      // Insert new relations
      if (actors.length > 0) {
        const actorRelations = actors.map((actorId) => ({
          movie_id: id,
          actor_id: actorId,
        }));
        await db("movie_actors").insert(actorRelations);
      }
    }

    return this.findById(id);
  },

  async findByIdAndDelete(id) {
    const movie = await this.findById(id);
    if (movie) {
      await db("movies").where({ id }).update({ deleted_at: db.fn.now() });
    }
    return movie;
  },
};

module.exports = Movie;
