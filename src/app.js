require("dotenv").config();
require("./strategies/discord");

const express = require("express");
const config = require("../config");
const passport = require("passport");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");
const Store = require("connect-mongo")(session);
const { graphqlHTTP } = require("express-graphql");
const RootSchema = require("./graphql");

const mongoPath = config.mongoPath;

// const mongoPath = "mongodb://127.0.0.1:27017/SmileyFace";

console.log(config.PORT);

const app = express();
const PORT = config.PORT || 3002;
const routes = require("./routes");

mongoose.connect(mongoPath, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    // origin: ["http://localhost:3000"],
    // origin: ["https://smiley-face-dashboard.benjics.repl.co"],
    origin: [
      "https://smileyface.xyz",
      "http://smileyface.xyz",
      "https://smiley-face-dashboard.benjics.repl.co",
      "http://smiley-face-dashboard.benjics.repl.co",
      "http://localhost:3000",
      "https://localhost:3000",
    ],
    // origin: ["https://smileyface.xyz"],
    // origin: ["https://smiley-face.glitch.me"],
    credentials: true,
  })
);

app.use(
  session({
    secret: "secret",
    cookie: {
      maxAge: 60000 * 60 * 24,
    },
    resave: false,
    saveUninitialized: false,
    store: new Store({ mongooseConnection: mongoose.connection }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema: RootSchema,
  })
);

app.use("/api", routes);

app.listen(PORT, () => console.log(`Running on Port ${PORT}`));
