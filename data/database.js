const mongodb = require("mongodb");
let mongodbUrl = "mongodb://127.0.0.1:27017";

if (process.env.MONGODB_URL) {
  mongodbUrl = process.env.MONGODB_URL;
}

const MongoClient = mongodb.MongoClient;

let database;

const connectToDatabase = async () => {
  const client = await MongoClient.connect(mongodbUrl);
  database = client.db("propsol");
};

const getDb = () => {
  if (!database) {
    throw { message: "You must connect first!" };
  }
  return database;
};

module.exports = {
  connectToDatabase: connectToDatabase,
  getDb: getDb,
  mongodbUrl: mongodbUrl,
};
