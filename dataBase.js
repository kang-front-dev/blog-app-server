const { MongoClient, ObjectId } = require('mongodb');
const client = new MongoClient(
  'mongodb+srv://admin:admin@cluster0.vcewazx.mongodb.net/?retryWrites=true&w=majority'
);

const startMongo = async () => {
  try {
    await client.connect();

    console.log('Database connected!');
  } catch (error) {
    console.log(error);
  }
};
startMongo();
const dataBase = client.db('blog-app');


const reviews = dataBase.collection('reviews');
const users = dataBase.collection('users');
const tags = dataBase.collection('tags');
const sessions = dataBase.collection('sessions');

module.exports = {reviews,users,tags,sessions}