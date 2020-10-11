const generateLink = (req, home, away) => {
  let prefix = "";
  const regex = /\s/gi;
  if (process.env.NODE_ENV === "development") {
    prefix = `${req.protocol}://localhost:5000`;
  } else if (process.env.NODE_ENV === "production") {
    prefix = `${req.protocol}://${req.get("host")}`;
  }
  let homeFormat = home.replace(regex, "_");
  let awayFormat = away.replace(regex, "_");
  return `${prefix}/match/fixtures/${homeFormat}/${awayFormat}`;
};

const fakeLink = () => {
  const URL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:5000"
      : "https://sportex-api.herokuapp.com";

  const codeLength = 8;
  const digits =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";

  for (let i = 1; i <= codeLength; i++) {
    const index = Math.floor(Math.random() * digits.length);
    code = code + digits[index];
  }

  const link = `${URL}/match/fixtures/link/${code}`;

  return link;
};

module.exports = {
  generateLink,
  fakeLink,
};
