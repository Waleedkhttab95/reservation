// get the roles from RedisDB
const { client } = require("../index");


// Read from Cache
 client.get('AUTH').then(result =>{


  module.exports.ROLES =  JSON.parse(result);

 })



