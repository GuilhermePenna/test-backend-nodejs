/*const mongoose = require("mongoose");

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;
const credentials = DB_USER ? `${DB_USER}:${DB_PASSWORD}@` : "";
const mongoURL = `mongodb://${credentials}${DB_HOST}:${DB_PORT}/${DB_NAME}`;
console.log(mongoURL);
module.exports = async () => {
  mongoose.connect(
    mongoURL,
    {
      useNewUrlParser: true,
      authSource: "admin",
      useUnifiedTopology: true,
    },
    (err) => {
      if (err) throw err;
      console.log("Connected to MongoDB!!!");
    }
  );
};*/

const config = require("./config/config");

var urlDbAnotaAi = config.db.anotaai;

console.log("VERSAO::" + mongoose.version);

const connect = async () => {
  anotaai = mongoose.createConnection(urlDbAnotaAi, {
    authSource: "admin",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  anotaai.then((db) => {
    console.log("CONECTOU", urlDbAnotaAi);
  });
  return {
    anotaai,
  };
};

module.exports = {
  connect,
};
