const express = require("express");
const bodyParser = require("body-parser");

// expressJS config
const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// express session
// app.use(
//     session({
//       store: new RedisStore({ client: redisClient }),
//       saveUninitialized: false,
//       secret: "secret" ,  //process.env.SESSION_SECRET,
//       resave: false,

//     })
//   )

module.exports.app;
