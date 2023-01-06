const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'https://frontview-kang.netlify.app');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

////////////////////////USERS///////////////////////

const UserService = require('./service/UserService');
const ReviewService = require('./service/ReviewService');
const TagsService = require('./service/TagsService');
const TokenService = require('./service/TokenService');

const authMiddleware = require('./middlewares/auth-middleware');
const { getUserInfo } = require('./service/UserService');

app.get('/getAllUsers', async (request, response) => {
  const serviceResponse = await UserService.getAllUsers();

  if (serviceResponse) {
    return response.status(200).json(serviceResponse);
  }
});
app.post('/regUser', async (request, response) => {
  const serviceResponse = await UserService.regUser(request.body);

  response.cookie('refreshToken', serviceResponse.refreshToken, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });

  return serviceResponse.success
    ? response.status(200).json(serviceResponse)
    : response.status(404).json(serviceResponse);
});
app.post('/logUser', async (request, response) => {
  const serviceResponse = await UserService.logUser(request.body);

  response.cookie('refreshToken', serviceResponse.refreshToken, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });

  if (serviceResponse.success) {
    return response.status(200).json(serviceResponse);
  } else if (serviceResponse.message === 'User does not exist') {
    return response.status(404).json(serviceResponse);
  } else {
    response.status(401).json(serviceResponse);
  }
});
app.delete('/logout', authMiddleware, async (request, response) => {
  const userData = await request.userData;

  if (!userData) {
    return response
      .status(401)
      .json({ success: false, message: 'Unauthorized error.' });
  }
  const { refreshToken } = await TokenService.findTokenById(userData.id);
  const serviceResponse = await UserService.logout(refreshToken);
  response.clearCookie('refreshToken');
  return serviceResponse.deletedCount
    ? response.status(200).json(serviceResponse)
    : response.status(404).json(serviceResponse);
});
app.patch('/getUserInfo', async (request, response) => {
  const serviceResponse = await UserService.getUserInfo(request.body);

  return serviceResponse.success
    ? response.status(200).json(serviceResponse)
    : response.status(404).json(serviceResponse);
});
app.patch('/updateUserInfo', async (request, response) => {
  const serviceResponse = await UserService.updateUserInfo(request.body);

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
app.delete('/deleteReview', async (request, response) => {
  const serviceResponse = await ReviewService.deleteReview(request.body);

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

app.post('/addComment', async (request, response) => {
  const serviceResponse = await ReviewService.addComment(request.body);

  return serviceResponse.success
    ? response.status(200).json(serviceResponse)
    : response.status(404).json(serviceResponse);
});
app.delete('/removeComment', async (request, response) => {
  const serviceResponse = await ReviewService.removeComment(request.body);

  return serviceResponse.success
    ? response.status(200).json(serviceResponse)
    : response.status(404).json(serviceResponse);
});

////////////////////////REVIEWS///////////////////////
////////////////////////TAGS//////////////////////////

app.get('/getAllTags', async (request, response) => {
  const serviceResponse = await TagsService.getAllTags();

  return serviceResponse.success
    ? response.status(200).json(serviceResponse)
    : response.status(404).json(serviceResponse);
});
app.patch('/updateTags', async (request, response) => {
  const serviceResponse = await TagsService.updateTags(request.body);

  return serviceResponse.success
    ? response.status(200).json(serviceResponse)
    : response.status(404).json(serviceResponse);
});

/////////////////////////TOKENS///////////////////////

app.get('/refresh', authMiddleware, async (request, response) => {
  const userData = await request.userData;
  if (!userData) {
    return response.status(401).json({ success: false });
  }
  const { id } = userData;
  const { refreshToken } = await TokenService.findTokenById(id);
  const serviceResponse = await UserService.refresh(refreshToken);
  response.cookie('refreshToken', serviceResponse.refreshToken, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
  return response.json(serviceResponse);
});

//////////////////////////////////////////////////////
app.listen(process.env.PORT, () => {
  console.log('app is running');
});
