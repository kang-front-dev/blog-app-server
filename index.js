const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

////////////////////////USERS///////////////////////

const UserService = require('./UserService');
const ReviewService = require('./ReviewService');
const TagsService = require('./TagsService');

app.get('/getAllUsers', async (request, response) => {
  const serviceResponse = await UserService.getAllUsers();

  if (serviceResponse) {
    return response.status(200).json(serviceResponse);
  }
});
app.post('/regUser', async (request, response) => {
  const serviceResponse = await UserService.regUser(request.body);

  return serviceResponse.success
    ? response.status(200).json(serviceResponse)
    : response.status(404).json(serviceResponse);
});
app.patch('/logUser', async (request, response) => {
  const serviceResponse = await UserService.logUser(request.body);

  return serviceResponse.success
    ? response.status(200).json(serviceResponse)
    : response.status(401).json(serviceResponse);
});
app.patch('/getUserInfo', async (request, response) => {
  const serviceResponse = await UserService.getUserInfo(request.body);

  return serviceResponse.success
    ? response.status(200).json(serviceResponse)
    : response.status(404).json(serviceResponse);
});
app.patch('/getUserAvatar', async (request, response) => {
  const serviceResponse = await UserService.getUserAvatar(request.body);

  return serviceResponse.success
    ? response.status(200).json(serviceResponse)
    : response.status(404).json(serviceResponse);
});

//////////////////////////////////////////////////////
////////////////////////REVIEWS///////////////////////

app.get('/getAllReviews', async (request, response) => {
  const serviceResponse = await ReviewService.getAllReviews();

  return serviceResponse.success
    ? response.status(200).json(serviceResponse)
    : response.status(404).json(serviceResponse);
});

app.post('/insertReview', async (request, response) => {
  const serviceResponse = await ReviewService.insertReview(request.body);

  return serviceResponse.success
    ? response.status(200).json(serviceResponse)
    : response.status(404).json(serviceResponse);
});

app.patch('/editReview', async (request, response) => {
  const serviceResponse = await ReviewService.editReview(request.body);

  return serviceResponse.success
    ? response.status(200).json(serviceResponse)
    : response.status(404).json(serviceResponse);
});

app.patch('/getUserReviews', async (request, response) => {
  const serviceResponse = await ReviewService.getUserReviews(request.body);

  return serviceResponse.success
    ? response.status(200).json(serviceResponse)
    : response.status(404).json(serviceResponse);
});

app.patch('/getReview', async (request, response) => {
  const serviceResponse = await ReviewService.getReview(request.body);

  return serviceResponse.success
    ? response.status(200).json(serviceResponse)
    : response.status(404).json(serviceResponse);
});

app.patch('/addLike', async (request, response) => {
  const serviceResponse = await ReviewService.addLike(request.body);

  return serviceResponse.success
    ? response.status(200).json(serviceResponse)
    : response.status(404).json(serviceResponse);
});

app.patch('/removeLike', async (request, response) => {
  const serviceResponse = await ReviewService.removeLike(request.body);

  return serviceResponse.success
    ? response.status(200).json(serviceResponse)
    : response.status(404).json(serviceResponse);
});

app.patch('/addDislike', async (request, response) => {
  const serviceResponse = await ReviewService.addDislike(request.body);

  return serviceResponse.success
    ? response.status(200).json(serviceResponse)
    : response.status(404).json(serviceResponse);
});

app.patch('/removeDislike', async (request, response) => {
  const serviceResponse = await ReviewService.removeDislike(request.body);

  return serviceResponse.success
    ? response.status(200).json(serviceResponse)
    : response.status(404).json(serviceResponse);
});

app.patch('/addView', async (request, response) => {
  const serviceResponse = await ReviewService.addView(request.body);

  return serviceResponse.success
    ? response.status(200).json(serviceResponse)
    : response.status(404).json(serviceResponse);
});

////////////////////////REVIEWS///////////////////////
////////////////////////TAGS//////////////////////////

app.patch('/updateTags', async (request, response) => {
  const serviceResponse = await TagsService(request.body);

  return serviceResponse.success
    ? response.status(200).json(serviceResponse)
    : response.status(404).json(serviceResponse);
});

//////////////////////////////////////////////////////
app.listen(process.env.PORT, () => {
  console.log('app is running');
});
