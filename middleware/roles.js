// get the roles from RedisDB
const { client } = require("../index");

let ROLES = {
  Admin: "Admin",
  Employee: "Employee",
};

module.exports = ROLES;

//  client.get('AUTH').then(result =>{

//      ROLES = JSON.parse(result)
//  })
