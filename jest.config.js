module.exports = {
  roots: ["<rootDir>"],
  collectCoverage: true,
  clearMocks: true,
  coverageDirectory: "coverage",
  testEnvironment: "node",
  setupFilesAfterEnv: ["./jest.setup.js"],
};
