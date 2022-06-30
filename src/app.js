// require("newrelic")
config = require("./config/config");
moment = require("moment-timezone");
moment.tz.setDefault("America/Sao_Paulo");
mongoose = require("mongoose");
express = require("express");
ObjectIDForModel = mongoose.Schema.Types.ObjectId;
ObjectId = mongoose.Types.ObjectId;
mongoose.Promise = require("q").Promise;
Promise = require("bluebird");
const database = require("./db");
const errorHandler = require("./utils/error-handler");

var app = express();
var cors = require("cors");
var bodyParser = require("body-parser");

// to get ip
app.enable("trust proxy");

app.set("port", process.env.PORT || 1232);

app.use(errorHandler);

app.use(
  bodyParser.json({
    limit: "1mb",
  })
);
app.use(
  bodyParser.urlencoded({
    limit: "1mb",
    extended: true,
  })
); // support encoded bodies

app.use(cors());

// VERIFICAR SE PRECISA REALMENTE DE CONEXAO COM BANCO DE DADOS
database
  .connect()
  .then(() => {
    //models = require("@githubanotaai/models")()

    const server = app.listen(app.get("port"), function () {
      console.log("servidor ligado porta " + app.get("port"));
    });
    server.timeout = 45000;

    const routes = require("./routes/auth/index");

    app.use(routes);

    app.use(function (req, res, next) {
      res.status(404);

      // respond with html page
      if (req.accepts("html")) {
        res.send("Not found");
        return;
      }

      // respond with json
      if (req.accepts("json")) {
        res.send({
          error: "Not found",
        });
        return;
      }

      // default to plain-text. send()
      res.type("txt").send("Not found");
    });
  })
  .catch((e) => {
    console.log(e);
    // Sentry.captureException(e);
  });
