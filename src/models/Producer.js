const db = require("../../database/db");

const Producer = {
  async find(filter = {}) {
    let query = db("producers");
    if (filter.name) {
      const nameVal = filter.name.$regex || filter.name;
      query = query.where("name", "like", `%${nameVal}%`);
    }
    return query.orderBy("created_at", "desc");
  },

  async findById(id) {
    return db("producers").where({ id }).first();
  },

  async create(data) {
    const [id] = await db("producers").insert(data);
    return this.findById(id);
  },

  async findByIdAndUpdate(id, data, options = {}) {
    data.updated_at = db.fn.now();
    await db("producers").where({ id }).update(data);
    return this.findById(id);
  },

  async findByIdAndDelete(id) {
    const producer = await this.findById(id);
    if (producer) {
      await db("producers").where({ id }).del();
    }
    return producer;
  },
};

module.exports = Producer;
