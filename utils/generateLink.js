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

module.exports = {
  generateLink,
};
