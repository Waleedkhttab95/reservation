// get the roles from RedisDB
const { client } = require("../index");

let ROLES 

// Read from Cache
 client.get('AUTH').then(result =>{

  ROLES = result
  module.exports = ROLES;

 })



