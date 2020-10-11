const {
  teams,
  populateTeams,
  post,
  authPost,
  get,
  authGet,
  authPut,
  put,
  authDelete,
  iDelete,
  populateUsers,
} = require("./seeds/seeds");

const noNameTeam = {
  stadium: "Standford Bridge",
};

const existingNameTeam = {
  name: "Chelsea FC",
  stadium: "Stanford Bridge",
};

const newTeam = {
  name: "Real Madrid FC",
  stadium: "Santiago Bernabeu",
};

const newUser = {
  name: "David Luiz",
  email: "davidluiz@example.com",
  password: "password",
};

const newAdminUser = {
  name: "Admin User",
  email: "admin@example.com",
  password: "password",
  isAdmin: true,
};

describe("#all teams test", () => {
  beforeEach(async (done) => {
    populateUsers(done);
    populateTeams(done);
  });

  describe("new team", () => {
    it("should not allow a non admin create a team", async (done) => {
      const userResponse = await post("/api/users/login", newUser);

      const response = await authPost(
        "/api/teams",
        newTeam,
        userResponse.body.token
      );

      expect(response.status).toBe(401);

      expect(response.body.success).toBeFalsy();

      done();
    });

    it("should not create a team without a name", async (done) => {
      const userResponse = await post("/api/users/login", {
        email: newAdminUser.email,
        password: newAdminUser.password,
      });

      const response = await authPost(
        "/api/teams",
        noNameTeam,
        userResponse.body.token
      );

      expect(response.status).toBe(400);

      expect(response.body.success).toBeFalsy();

      done();
    });

    it("should not create an existing team", async (done) => {
      const userResponse = await post("/api/users/login", {
        email: newAdminUser.email,
        password: newAdminUser.password,
      });

      const response = await authPost(
        "/api/teams",
        existingNameTeam,
        userResponse.body.token
      );

      expect(response.status).toBe(400);

      expect(response.body.success).toBeFalsy();

      done();
    });

    it("should create a team successfully", async (done) => {
      const userResponse = await post("/api/users/login", {
        email: newAdminUser.email,
        password: newAdminUser.password,
      });

      const response = await authPost(
        "/api/teams",
        newTeam,
        userResponse.body.token
      );

      expect(response.status).toBe(201);

      done();
    });
  });

  describe("get a team", () => {
    it("should not allow a non auth user to get a team", async (done) => {
      const userResponse = await post("/api/users/login", {
        email: "bruno@example.com",
        password: "password",
      });

      const response = await authGet(
        `/api/teams/${teams[0]._id}`,
        userResponse.body.token
      );

      expect(response.status).toBe(401);

      done();
    });

    it("should not allow a non admin user to get a team", async (done) => {
      const userResponse = await post("/api/users/login", {
        email: newUser.email,
        password: newUser.password,
      });
      const response = await authGet(
        `/api/teams/${teams[0]._id}`,
        userResponse.body.token
      );

      expect(response.status).toBe(401);

      expect(response.body.success).toBeFalsy();

      done();
    });

    it("should return an error if requested team does not exist", async (done) => {
      const userResponse = await post("/api/users/login", {
        email: newAdminUser.email,
        password: newAdminUser.password,
      });

      const response = await authGet(
        `/api/teams/123456`,
        userResponse.body.token
      );

      expect(response.status).toBe(404);

      expect(response.body.success).toBeFalsy();

      done();
    });

    it("should return a team for an auth admin user", async (done) => {
      const userResponse = await post("/api/users/login", {
        email: newAdminUser.email,
        password: newAdminUser.password,
      });

      const response = await authGet(
        `/api/teams/${teams[0]._id}`,
        userResponse.body.token
      );

      expect(response.status).toBe(200);

      done();
    });
  });

  describe("get teams", () => {
    it("should not allow a non auth user to get teams", async (done) => {
      const userResponse = await post(`/api/users/login`, {
        email: newUser.email,
        password: newUser.password,
      });

      const response = await authGet("/api/teams", userResponse.body.token);

      expect(response.status).toBe(404);

      expect(response.body.success).toBeFalsy();

      done();
    });

    it("should return all teams for a non auth user", async (done) => {
      const userResponse = await post(`/api/users/login`, {
        email: "john@example.com",
        password: "password",
      });

      const response = await authGet("/api/teams", userResponse.body.token);

      expect(response.status).toBe(200);

      done();
    });
  });

  describe("update a team", () => {
    it("should not allow a non-auth user update a team", async (done) => {
      const userResponse = await post(`/api/users/login`, {
        email: "john@example.com",
        password: "password",
      });

      const response = await authPut(
        `/api/teams/${teams[0]._id}`,
        { name: "Arsenal FC2" },
        userResponse.body.token
      );

      expect(response.status).toBe(401);

      done();
    });

    it("should update a team successfully", async (done) => {
      const userResponse = await post(`/api/users/login`, {
        email: newAdminUser.email,
        password: newAdminUser.password,
      });

      const response = await authPut(
        `/api/teams/${teams[0]._id}`,
        { name: "Arsenal FC2" },
        userResponse.body.token
      );

      expect(response.status).toBe(200);

      done();
    });
  });

  describe("delete a team", () => {
    it("should not allow a non auth user delete a team", async (done) => {
      const userResponse = await post(`/api/users/login`, {
        email: "john@example.com",
        password: "password",
      });
      const response = await authDelete(
        `/api/teams/${teams[0]._id}`,
        userResponse.body.token
      );

      expect(response.status).toBe(401);

      done();
    });

    it("should delete a team successfully", async (done) => {
      const userResponse = await post(`/api/users/login`, {
        email: newAdminUser.email,
        password: newAdminUser.password,
      });
      const response = await authDelete(
        `/api/teams/${teams[0]._id}`,
        userResponse.body.token
      );

      expect(response.status).toBe(200);

      done();
    });
  });
});
