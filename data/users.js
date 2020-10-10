const bcrypt = require("bcryptjs");

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: bcrypt.hashSync("password", 10),
    isAdmin: true,
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: bcrypt.hashSync("password", 10),
  },
  {
    name: "Jane Doe",
    email: "jane@example.com",
    password: bcrypt.hashSync("password", 10),
  },
  {
    name: "Kenneth Jones",
    email: "kenneth@example.com",
    password: bcrypt.hashSync("password", 10),
  },
  {
    name: "Tom Browne",
    email: "tombrowne@example.com",
    password: bcrypt.hashSync("password", 10),
  },
  {
    name: "Michael Jackson",
    email: "michaeljackson@example.com",
    password: bcrypt.hashSync("password", 10),
  },
  {
    name: "James Brown",
    email: "jamesbrown@example.com",
    password: bcrypt.hashSync("password", 10),
  },
  {
    name: "Marvin Gaye",
    email: "marvingaye@example.com",
    password: bcrypt.hashSync("password", 10),
  },
  {
    name: "Deborah Lee",
    email: "deborahlee@example.com",
    password: bcrypt.hashSync("password", 10),
  },
  {
    name: "Collins Maxwell",
    email: "collinsmaxwell@example.com",
    password: bcrypt.hashSync("password", 10),
  },
];

module.exports = users;
