const { createClient } = require("redis");
const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const bodyParser = require("body-parser");

const client = createClient({
  port: 6379,
  host: "redis" 

});

// expressJS config
const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1);

// DB Connection
const db = new Sequelize("docker", "docker", "123456", {
  host: "db",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

try {
  db.authenticate().then(async () => {
    console.log("Connection has been established successfully.");

    // connect Redis cache 
   await client.connect();

    // set some data to cache just for test 
    const ROLES = {
      Admin: "Admin",
      Employee: "Employee",
    };
   await client.set('AUTH', JSON.stringify(ROLES));

    // routes
    require("./routes/authRoutes")(app);
    require("./routes/reservationRoutes")(app);
    require("./routes/tableManagementRoutes")(app);

    await db.sync({ force: true });
  });
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

app.get('/api' , (req,res) =>{
  res.status(200).send('Hello To Restaurant App')
})

// Run App
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`App Running Port :${PORT}`));

module.exports.db = db;
module.exports.client = client;
