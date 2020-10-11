const request = require("supertest");
const { ObjectId } = require("mongoose").Types;
const app = require("../../src/index");
const Fixture = require("../../src/models/Fixture");
const Team = require("../../src/models/Team");
const User = require("../../src/models/User");
const { fakeLink } = require("../../src/utils/generateLink");

const post = (url, body) => {
  const httpRequest = request(app).post(url);

  httpRequest.send(body);

  return httpRequest;
};

const authPost = (url, body, token) => {
  const httpRequest = request(app).post(url);

  httpRequest.send(body);

  httpRequest.set("Authorization", `Bearer ${token}`);

  return httpRequest;
};

const authPut = (url, body, token) => {
  const httpRequest = request(app).put(url);

  httpRequest.send(body);

  httpRequest.set("Authorization", `Bearer ${token}`);

  return httpRequest;
};

const put = (url, body) => {
  const httpRequest = request(app).put(url);
  httpRequest.send(body);
  return httpRequest;
};

const get = (url) => {
  const httpRequest = request(app).get(url);
  return httpRequest;
};

const authGet = (url, token) => {
  const httpRequest = request(app).get(url);
  httpRequest.set("Authorization", `Bearer ${token}`);
  return httpRequest;
};

const authDelete = (url, token) => {
  const httpRequest = request(app).delete(url);

  httpRequest.set("Authorization", `Bearer ${token}`);

  return httpRequest;
};

const users = [
  {
    _id: new ObjectId(),
    name: "Admin User",
    email: "admin@example.com",
    password: "password",
    isAdmin: true,
  },
  {
    _id: new ObjectId(),

    name: "John Doe",
    email: "john@example.com",
    password: "password",
  },
  {
    _id: new ObjectId(),

    name: "Jane Doe",
    email: "jane@example.com",
    password: "password",
  },
  {
    _id: new ObjectId(),

    name: "Kenneth Jones",
    email: "kenneth@example.com",
    password: "password",
  },
  {
    _id: new ObjectId(),

    name: "Tom Browne",
    email: "tombrowne@example.com",
    password: "password",
  },
  {
    _id: new ObjectId(),

    name: "Michael Jackson",
    email: "michaeljackson@example.com",
    password: "password",
  },
];

const populateUsers = (done) => {
  User.deleteMany({})
    .then(() => {
      const userOne = new User(users[0]).save();
      const userTwo = new User(users[1]).save();
      const userThree = new User(users[2]).save();
      const userFour = new User(users[3]).save();
      const userFive = new User(users[4]).save();
      const userSix = new User(users[5]).save();

      return Promise.all([
        userOne,
        userTwo,
        userThree,
        userFour,
        userFive,
        userSix,
      ]);
    })
    .then(() => done());
};

const teams = [
  {
    _id: new ObjectId(),
    name: "Arsenal FC",
    stadium: "Emirates",
  },
  {
    _id: new ObjectId(),
    name: "Manchester United",
    stadium: "Old Trafford",
  },
  {
    _id: new ObjectId(),
    name: "Chelsea FC",
    stadium: "Stanford Bridge",
  },
  {
    _id: new ObjectId(),
    name: "Liverpool FC",
    stadium: "Anfield",
  },
];

const populateTeams = (done) => {
  Team.deleteMany({})
    .then(() => {
      const teamOne = new Team(teams[0]).save();
      const teamTwo = new Team(teams[1]).save();
      const teamThree = new Team(teams[2]).save();
      const teamFour = new Team(teams[3]).save();

      return Promise.all([teamOne, teamTwo, teamThree, teamFour]);
    })
    .then(() => done());
};

const fixtures = [
  {
    _id: new ObjectId(),
    status: "pending",
    homeTeam: teams[0]._id,
    awayTeam: teams[1]._id,
    link: fakeLink(),
  },
  {
    _id: new ObjectId(),
    status: "completed",
    homeTeam: teams[2]._id,
    awayTeam: teams[3]._id,
    link: fakeLink(),
  },
];

const populateFixtures = (done) => {
  Fixture.deleteMany({})
    .then(() => {
      const fixtureOne = new Fixture(fixtures[0]).save();
      const fixtureTwo = new Fixture(fixtures[1]).save();

      return Promise.all([fixtureOne, fixtureTwo]);
    })
    .then(() => done());
};

module.exports = {
  post,
  authPost,
  authPut,
  put,
  get,
  authGet,
  authDelete,
  populateUsers,
  populateTeams,
  populateFixtures,
  users,
  teams,
  fixtures,
};
