const db = require("../../database/db");

const Actor = {
  async find(filter = {}) {
    let query = db("actors");
    if (filter.name) {
      // Expecting a regex-like object from older code, we translate it to LIKE
      // { name: { $regex: name, $options: "i" } }
      const nameVal = filter.name.$regex || filter.name;
      query = query.where("name", "like", `%${nameVal}%`);
    }
    return query.orderBy("created_at", "desc");
  },

  async findById(id) {
    return db("actors").where({ id }).first();
  },

  async create(data) {
    const [id] = await db("actors").insert(data);
    return this.findById(id);
  },

  async findByIdAndUpdate(id, data, options = {}) {
    data.updated_at = db.fn.now();
    await db("actors").where({ id }).update(data);
    return this.findById(id);
  },

  async findByIdAndDelete(id) {
    const actor = await this.findById(id);
    if (actor) {
      await db("actors").where({ id }).del();
    }
    return actor;
  },
};

module.exports = Actor;
