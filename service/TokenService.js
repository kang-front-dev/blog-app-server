const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { sessions } = require('../dataBase');

class TokenService {
  generateToken(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '7d',
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '30d',
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
    const objectId = id instanceof ObjectId ? id : new ObjectId(id)
    const tokenData = await sessions.findOne({ user: objectId });
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
