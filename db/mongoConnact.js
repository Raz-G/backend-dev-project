const mongoose = require('mongoose');
const {config} = require("../conifg/secret");

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(`mongodb+srv://${config.userDb}:${config.passDb}@cluster0.msasxia.mongodb.net/Project`);
  console.log("mongo connect black 22 a1")
}