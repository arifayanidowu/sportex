const {
  users,
  populateUsers,
  post,
  get,
  authGet,
  authPut,
  authDelete,
} = require("./seeds/seeds");

const adminUser = {
  name: "Admin",
  email: "admin@example.com",
  password: "password",
};

const noEmailUser = {
  name: "Jack Clyde",
  password: "password",
};

const noNameUser = {
  email: "john@example",
  password: "password",
};

const existingUser = {
  name: "John Doe",
  email: "john@example.com",
  password: "password",
};

const newUser = {
  name: "Donald Trump",
  email: "donald@example.com",
  password: "password",
};

const newAdminUser = {
  name: "Jackson Grove",
  email: "jackgrove@example.com",
  password: "password",
  isAdmin: true,
};

const loginCredentials = {
  email: "michaeljackson@example.com",
  password: "password",
};

describe("#All user test", () => {
  beforeEach(async (done) => {
    populateUsers(done);
  });

  describe("new users", () => {
    it("should not create a user with no email", async (done) => {
      const response = await post("/api/users/register", noEmailUser);
      expect(response.status).toBe(400);
      expect(response.body.status).toBe(false);
      done();
    });

    it("should not create a user with an existing email", async (done) => {
      const response = await post("/api/users/register", existingUser);
      expect(response.status).toBe(400);
      expect(response.body.status).toBe(false);
      done();
    });

    it("should not create a user with no name", async (done) => {
      const response = await post("/api/users/register", noNameUser);
      expect(response.status).toBe(400);
      expect(response.body.status).toBe(false);
      done();
    });

    it("should return a newly created user", async (done) => {
      const response = await post("/api/users/register", newUser);
      expect(response.status).toBe(201);
      expect(response.body.name).toEqual(newUser.name);
      expect(response.body.password).not.toEqual(newUser.password);
      expect(response.body.isAdmin).toBeFalsy();
      expect(response.body.token).toBeTruthy();
      done();
    });

    it("should create an admin when 'isAdmin' is set to true", async (done) => {
      const response = await post("/api/users/register", newAdminUser);
      expect(response.status).toBe(201);
      expect(response.body.name).toEqual(newAdminUser.name);
      expect(response.body.password).not.toEqual(newAdminUser.password);
      expect(response.body.isAdmin).toBeTruthy();
      expect(response.body.token).toBeTruthy();
      done();
    });
  });

  describe("user login", () => {
    it("should return an error if credentials are incomplete", async (done) => {
      const response = await post("/api/users/login", {
        email: loginCredentials.email,
      });

      expect(response.status).toBe(500);
      expect(response.body.success).toBeFalsy();
      done();
    });

    it("should throw an error if wrong password is set", async (done) => {
      const response = await post("/api/users/login", {
        email: loginCredentials.email,
        password: "password@2",
      });
      expect(response.status).toBe(401);
      expect(response.body.success).toBeFalsy();
      done();
    });

    it("should throw an error is an invalid user tries to login", async (done) => {
      const response = await post("/api/users/login", {
        email: "akanni@example.com",
        password: "password@2",
      });
      expect(response.status).toBe(401);
      expect(response.body.success).toBeFalsy();
      done();
    });

    it("should return a user object for user with the right credentials", async (done) => {
      const response = await post("/api/users/login", {
        email: loginCredentials.email,
        password: loginCredentials.password,
      });

      expect(response.status).toBe(200);

      expect(response.body.email).toBe(loginCredentials.email);
      expect(response.body.password).not.toEqual(loginCredentials.password);
      expect(response.body.token).toBeTruthy();

      done();
    });
  });

  describe("get a user", () => {
    it("should return an error if an unauthenticated user tries to get a user", async (done) => {
      const newResponse = await post("/api/users/register", newUser);

      const response = await get(`/api/users/${newResponse.body._id}`);

      expect(response.status).toBe(401);
      expect(response.success).toBeFalsy();

      done();
    });

    it("should return an error if the requested user does not exist", async (done) => {
      const newResponse = await post("/api/users/login", newUser);

      const response = await authGet(
        "/api/users/5ebb63b8fd38911b67dc450d",
        newResponse.body.token
      );

      expect(response.status).toBe(401);

      expect(response.success).toBeFalsy();

      done();
    });

    it("should return an object for an authenticated Admin user", async (done) => {
      const newResponse = await post("/api/users/login", adminUser);

      const response = await authGet(
        `/api/users/${newResponse.body._id}`,
        newResponse.body.token
      );

      expect(response.status).toBe(200);

      done();
    });
  });

  describe("update a user", () => {
    it("should return an error is requester is not admin", async (done) => {
      const userId = users[0]._id;
      const newResponse = await post("/api/users/login", newUser);

      const response = await authPut(
        `/api/users/${userId}`,
        { name: "Adama" },
        newResponse.body.token
      );

      expect(response.status).toBe(401);

      expect(response.success).toBeFalsy();

      done();
    });

    it("should update user if requester is admin", async (done) => {
      const userId = users[0]._id;
      const newResponse = await post("/api/users/login", {
        email: users[0].email,
        password: users[0].password,
      });

      const response = await authPut(
        `/api/users/${userId}`,
        { name: "Admina User", isAdmin: false },
        newResponse.body.token
      );

      expect(response.status).toBe(200);

      done();
    });
  });

  describe("get all users", () => {
    it("should return an error is requestor is a public user", async (done) => {
      const response = await get("/api/users");

      expect(response.status).toBe(401);
      expect(response.body.success).toBeFalsy();

      done();
    });

    it("should return an error if requester is non-admin", async (done) => {
      const newResponse = await post("/api/users/login", {
        email: users[1].email,
        password: users[1].password,
      });

      const response = await authGet("/api/users", newResponse.body.token);

      expect(response.status).toBe(401);
      expect(response.body.success).toBeFalsy();

      done();
    });

    it("should return array of users for authenticated admin user", async (done) => {
      const newResponse = await post("/api/users/login", {
        email: users[0].email,
        password: users[0].password,
      });

      const response = await authGet("/api/users", newResponse.body.token);

      expect(response.status).toBe(200);

      expect(response.body).toBeTruthy();

      done();
    });
  });

  describe("delete a user", () => {
    it("should return an error if requester is not an admin", async (done) => {
      const newResponse = await post("/api/users/login", {
        email: users[1].email,
        password: users[1].password,
      });

      const response = await authDelete(
        `/api/users/${users[5]._id}`,
        newResponse.body.token
      );

      expect(response.status).toBe(401);
      expect(response.body.success).toBeFalsy();

      done();
    });

    it("should return an error if user does not exist", async (done) => {
      const newResponse = await post("/api/users/login", {
        email: users[0].email,
        password: users[0].password,
      });

      const response = await authDelete(
        `/api/users/5ebb63b8fd38911b67dc450d`,
        newResponse.body.token
      );

      expect(response.status).toBe(404);
      expect(response.body.success).toBeFalsy();

      done();
    });

    it("should delete user if requester is an admin", async (done) => {
      const newResponse = await post("/api/users/login", {
        email: users[0].email,
        password: users[0].password,
      });

      const response = await authDelete(
        `/api/users/${users[5]._id}`,
        newResponse.body.token
      );

      expect(response.status).toBe(200);

      done();
    });
  });
});
