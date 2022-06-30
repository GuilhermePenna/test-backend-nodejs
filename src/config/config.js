require("dotenv").config();

module.exports = {
  authKey: "ismLds)(aasdismaias!432d32(*fds14asd@421",
  db: {
    anotaai:
      process.env.URLDB ||
      "mongodb+srv://stagingbot_2:54RtGsfetrUso875sJENnb@cluster1.fccdc.mongodb.net/stagingbot?retryWrites=true&w=majority&wtimeoutMS=5000",
  },
  sentryUrl:
    process.env.SENTRY_URL ||
    "http://d7629288d2ac4795b92ed3c66cedeb98@sentry.anota.ai/4",
  env: "dev",
};
