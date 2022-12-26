const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { sessions } = require('../dataBase');

class TokenService {
  generateToken(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '30m',
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '15d',
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await sessions.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      await sessions.updateOne(
        { user: userId },
        {
          $set: {
            ...tokenData,
          },
        }
      );
      return;
    }
    const token = await sessions.insertOne({ user: userId, refreshToken });
    return token;
  }

  async removeToken(refreshToken) {
    const tokenData = await sessions.deleteOne({ refreshToken });
    return tokenData;
  }

  async findToken(refreshToken) {
    const tokenData = await sessions.findOne({ refreshToken });
    return tokenData;
  }
  async findTokenById(id) {
    console.log(id,'findtoken');
    const tokenData = await sessions.findOne({ user: new ObjectId(id) });
    return tokenData;
  }

  async validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (error) {
      return null;
    }
  }

  async validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (error) {
      return null;
    }
  }
}

module.exports = new TokenService();
