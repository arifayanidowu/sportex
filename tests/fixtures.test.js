const { fakeLink } = require("../src/utils/generateLink");
const {
  fixtures,
  teams,
  populateFixtures,
  post,
  authPost,
  get,
  authGet,
  authPut,
  put,
  authDelete,
  iDelete,
  populateTeams,
  populateUsers,
} = require("./seeds/seeds");

const newFixture = {
  homeTeam: teams[0]._id,
  awayTeam: teams[3]._id,
  link: fakeLink(),
};

const sameTeamFixture = {
  homeTeam: teams[0]._id,
  awayTeam: teams[0]._id,
  link: fakeLink(),
};

const noLinkFixture = {
  homeTeam: teams[0]._id,
  awayTeam: teams[2]._id,
};

const newUser = {
  name: "Donald Trump",
  email: "donald@example.com",
  password: "password",
};

const newAdminUser = {
  name: "Admin User",
  email: "admin@example.com",
  password: "password",
  isAdmin: true,
};

describe("#all fixtures test", () => {
  beforeEach(async (done) => {
    populateUsers(done);
    populateTeams(done);
    populateFixtures(done);
  });

  describe("new fixture", () => {
    it("should not allow a non auth user create fixture", async (done) => {
      const response = await post("/api/fixtures", newFixture);

      expect(response.status).toBe(401);

      expect(response.body.success).toBeFalsy();

      done();
    });

    it("should not allow a non authenticated admin user", async (done) => {
      const userResponse = await authPost("/api/users/login", {
        email: newUser.email,
        password: newUser.password,
      });
      const response = await authPost(
        "/api/fixtures",
        newFixture,
        userResponse.body.token
      );

      expect(response.status).toBe(401);

      expect(response.body.success).toBeFalsy();

      done();
    });

    it("should not play a fixture against the same team", async (done) => {
      const userResponse = await authPost("/api/users/login", {
        email: newUser.email,
        password: newUser.password,
      });

      const response = await authPost(
        "/api/fixtures",
        sameTeamFixture,
        userResponse.body.token
      );
      expect(response.status).toBe(401);

      expect(response.body.success).toBeFalsy();

      done();
    });

    it("should create a new fixture", async (done) => {
      const userResponse = await authPost("/api/users/login", {
        email: newAdminUser.email,
        password: newAdminUser.password,
      });

      const response = await authPost(
        "/api/fixtures",
        newFixture,
        userResponse.body.token
      );
      expect(response.status).toBe(201);

      done();
    });
  });

  describe("get a fixture", () => {
    it("should return an error if link is not provided", async (done) => {
      const userResponse = await authPost("/api/users/login", {
        email: newAdminUser.email,
        password: newAdminUser.password,
      });
      const response = await authGet(
        `/api/fixtures/fixture/https://localhost15271`,
        userResponse.body.token
      );
      expect(response.status).toBe(404);

      done();
    });

    it("should return an error if user is not authenticated", async (done) => {
      const userResponse = await authPost("/api/users/login", {
        email: newUser.email,
        password: newUser.password,
      });
      const response = await authGet(
        `/api/fixtures/fixture/${fixtures[0]._id}`,
        userResponse.body.token
      );
      expect(response.status).toBe(401);

      done();
    });

    it("should return a fixture for an admin user", async (done) => {
      const userResponse = await authPost("/api/users/login", {
        email: newAdminUser.email,
        password: newAdminUser.password,
      });
      const response = await authGet(
        `/api/fixtures/fixture/${fixtures[0]._id}`,
        userResponse.body.token
      );
      expect(response.status).toBe(200);

      done();
    });
  });

  describe("get all fixtures", () => {
    it("should return all fixtures for admin user", async (done) => {
      const userResponse = await authPost("/api/users/login", {
        email: newAdminUser.email,
        password: newAdminUser.password,
      });
      const response = await authGet(`/api/fixtures`, userResponse.body.token);
      expect(response.status).toBe(200);

      done();
    });
  });

  describe("update a fixture", () => {
    it("should not allow a non authenticated user update a fixture", async (done) => {
      const userResponse = await authPost("/api/users/login", {
        email: newUser.email,
        password: newUser.password,
      });
      const response = await authPut(
        `/api/fixtures/${fixtures[0]._id}`,
        { homeTeam: teams[3]._id },
        userResponse.body.token
      );
      expect(response.status).toBe(401);

      expect(response.body.success).toBeFalsy();

      done();
    });

    it("should update a fixture successfully", async (done) => {
      const userResponse = await authPost("/api/users/login", {
        email: newAdminUser.email,
        password: newAdminUser.password,
      });
      const response = await authPut(
        `/api/fixtures/${fixtures[0]._id}`,
        { homeTeam: teams[3]._id },
        userResponse.body.token
      );
      expect(response.status).toBe(200);

      done();
    });
  });

  describe("delete fixture", () => {
    it("should not allow non authenticated user delete a fixture", async (done) => {
      const userResponse = await authPost("/api/users/login", {
        email: newUser.email,
        password: newUser.password,
      });
      const response = await authDelete(
        `/api/fixtures/${fixtures[0]._id}`,
        userResponse.body.token
      );
      expect(response.status).toBe(401);

      expect(response.body.success).toBeFalsy();

      done();
    });

    it("should delete a fixture successfully", async (done) => {
      const userResponse = await authPost("/api/users/login", {
        email: newAdminUser.email,
        password: newAdminUser.password,
      });
      const response = await authDelete(
        `/api/fixtures/${fixtures[0]._id}`,
        userResponse.body.token
      );

      expect(response.status).toBe(200);

      expect(response.body.message).toBe("Fixture removed");

      done();
    });
  });
});
