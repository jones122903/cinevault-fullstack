const db = require("../../database/db");
const bcrypt = require("bcrypt");

const User = {
  async create(userData) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const [id] = await db("users").insert({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || "user",
    });

    return this.findById(id);
  },

  async findOne(filter) {
    return db("users").where(filter).first();
  },

  async findById(id) {
    return db("users").where({ id }).first();
  },

  async comparePassword(candidatePassword, userPassword) {
    return bcrypt.compare(candidatePassword, userPassword);
  },
};

module.exports = User;
