const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const { MongoClient, ObjectId } = require('mongodb');
dotenv.config();

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

const reviews = client.db('blog-app').collection('reviews');
const users = client.db('blog-app').collection('users');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

////////////////////////USERS///////////////////////

app.get('/getAllUsers', async (request, response) => {
  const result = await users.find();
  if (result) {
    return response.status(200).json({ success: true });
  }
});
app.post('/regUser', async (request, response) => {
  const isNameTaken = await users.findOne({
    name: request.body.name,
  });
  const isEmailTaken = await users.findOne({
    email: request.body.email,
  });
  if (!isNameTaken && !isEmailTaken) {
    const salt = bcrypt.genSaltSync(10);
    const passHash = bcrypt.hashSync(request.body.password, salt);
    const query = {
      name: request.body.name,
      email: request.body.email,
      password: passHash,
      avatarImgPath: '',
    };
    const result = await users.insertOne(query);
    return result
      ? response.status(200).json({ success: true })
      : response.status(404).json({ success: false, message: 'Unknown error' });
  } else {
    return response.status(400).json({
      success: false,
      message: isNameTaken ? 'Name already taken' : 'Email already taken',
    });
  }
});
app.patch('/logUser', async (request, response) => {
  const query = {
    email: request.body.email,
  };
  const result = await users.findOne(query);
  const isPassValid = bcrypt.compareSync(
    request.body.password,
    result.password
  );
  return isPassValid
    ? response.status(200).json({ success: true, message: 'Welcome back!' })
    : response
        .status(401)
        .json({ success: false, message: 'Invalid password.' });
});

////////////////////////USERS///////////////////////
////////////////////////REVIEWS///////////////////////

app.get('/getAllReviews', async (request, response) => {
  const result = await reviews.find().toArray();
  if (result) {
    return response.status(200).json({ success: true, reviews: result });
  }
});

app.post('/insertReview', async (request, response) => {
  const query = {
    title: request.body.title,
    descr: request.body.descr,
    group: request.body.group,
    tags: request.body.tags,
    imgPath: request.body.imgPath,
    // author: request.body.author,
    likes: 0,
    dislikes: 0,
    views: 0,
    rating: request.body.rating,
    comments: [],
  };
  const result = await reviews.insertOne(query);
  if (result) {
    return response.status(200).json({ success: true });
  }
});

app.post('/updateViewsReview', async (request, response) => {
  const query = {
    _id: new ObjectId(request.body._id),
  };
  const targetReview = await reviews.findOne(query);
  const updateQuery = {
    $set: {
      views: targetReview.views + 1,
    },
  };
  const updateResult = await reviews.updateOne(query, updateQuery);
  console.log(updateResult,'update result');
  if (updateResult) {
    return response.status(200).json({ success: true });
  }
});

app.patch('/editReview', async (request, response) => {
  const query = {
    _id: new ObjectId(request.body._id),
  };
  const editQuery = {
    $set: {
      title: request.body.title,
      descr: request.body.descr,
      groups: request.body.groups,
      tags: request.body.tags,
      rating: request.body.rating,
    },
  };
  const result = await reviews.findOneAndUpdate(query, editQuery);
  return result
    ? response.status(200).json({ success: true })
    : response.status(404).json({ success: false, message: 'Unknown error' });
});

////////////////////////REVIEWS///////////////////////
app.listen(process.env.PORT, () => {
  console.log('app is running');
});
