const { users } = require('../dataBase');
const TokenService = require('./TokenService');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
class UserService {
  async getAllUsers() {
    const result = await users.find();
    if (result) {
      return { success: true, users: result.users };
    }
  }

  async regUser(userInfo) {
    const isNameTaken = await users.findOne({
      name: userInfo.name,
    });
    const isEmailTaken = await users.findOne({
      email: userInfo.email,
    });
    if (!isNameTaken && !isEmailTaken) {
      const salt = bcrypt.genSaltSync(10);
      const passHash = bcrypt.hashSync(userInfo.password, salt);
      const query = {
        name: userInfo.name,
        email: userInfo.email,
        password: passHash,
        avatarImgPath: '',
      };

      const result = await users.insertOne(query);

      const tokens = TokenService.generateToken({
        id: result.insertedId,
        name: userInfo.name,
        email: userInfo.email,
      });

      await TokenService.saveToken(result.insertedId, tokens.refreshToken);

      console.log(userInfo.name, 'New user just came!');
      return result
        ? {
            success: true,
            ...tokens,
            userData: {
              id: result.insertedId,
              name: userInfo.name,
              email: userInfo.email,
              avatarImgPath: '',
            },
          }
        : { success: false, message: 'Unknown error' };
    } else {
      return {
        success: false,
        message: isNameTaken ? 'Name already taken' : 'Email already taken',
      };
    }
  }

  async logUser(userInfo) {
    const query = {
      email: userInfo.email,
    };
    const result = await users.findOne(query);
    if (!result) {
      return { success: false, message: 'User does not exist' };
    }
    const isPassValid = bcrypt.compareSync(userInfo.password, result.password);
    if (!isPassValid) {
      return { success: false, message: 'Invalid password.' };
    }
    const tokens = TokenService.generateToken({
      id: result._id,
      name: result.name,
      email: result.email,
    });
    await TokenService.saveToken(result._id, tokens.refreshToken);
    console.log(result.name, 'Logged in!');
    return {
      success: true,
      message: 'Welcome back!',
      userData: {
        id: result._id,
        name: result.name,
        email: result.email,
        avatarImgPath: result.avatarImgPath,
      },
      ...tokens,
    };
  }

  async logout(refreshToken) {
    const token = await TokenService.removeToken(refreshToken);
    return token.deletedCount ? { success: true } : { success: false };
  }

  async getUserInfo(userInfo) {
    const query = {
      name: userInfo.name,
    };
    const result = await users.findOne(query);

    return result
      ? { success: true, userData: result }
      : { success: false, message: 'User not found.' };
  }

  async updateUserInfo(userInfo){
    const query = {
      name: userInfo.name,
    };
    const findRes = await users.findOne(query);
    if(!findRes){
      return { success: false, message: 'User not found.' }
    }
    const updateQuery = {
      $set:{
        name: userInfo.name,
        email: userInfo.email,
        avatarImgPath: userInfo.avatarImgPath,
      }
    }
    const updateRes = await users.updateOne(query,updateQuery)
    return updateRes
    ? { success: true, message: 'Successfully updated!' }
    : { success: false, message: 'Unknown error.' }
  }

  async getUserAvatar(userInfo) {
    const query = {
      name: userInfo.name,
    };
    const result = await users.findOne(query);
    return result
      ? { success: true, imgPath: result.avatarImgPath }
      : { success: false, message: 'User not found.' };
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      return { success: false, message: 'Unauthorized error' };
    }
    const userData = await TokenService.validateRefreshToken(refreshToken);
    if (!userData) {
      return { success: false, message: 'Unauthorized error' };
    }

    const result = await users.findOne({ _id: new ObjectId(userData.id) });
    if (!result) {
      return { success: false, message: 'Unauthorized error' };
    }
    const tokens = TokenService.generateToken({
      id: result._id,
      name: result.name,
      email: result.email,
    });
    await TokenService.saveToken(result._id, tokens.refreshToken);
    console.log(result.name, 'Refreshed!');
    return {
      success: true,
      message: 'Welcome back!',
      userData: {
        id: result._id,
        name: result.name,
        email: result.email,
      },
      ...tokens,
    };
  }
}

module.exports = new UserService();
