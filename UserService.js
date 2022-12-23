const { users } = require('./dataBase');

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
      return result
        ? { success: true }
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
    const isPassValid = bcrypt.compareSync(userInfo.password, result.password);
    return isPassValid
      ? { success: true, message: 'Welcome back!', userData: result }
      : { success: false, message: 'Invalid password.' };
  }

  async getUserInfo(userInfo){
    const query = {
      name: userInfo.name,
    };
    const result = await users.findOne(query);
  
    return result
      ? { success: true, userData: result }
      : { success: false, message: 'User not found.' };
  }

  async getUserAvatar(userInfo){
    const query = {
      name: userInfo.name,
    };
    const result = await users.findOne(query);
    return result
      ? { success: true, imgPath: result.avatarImgPath }
      : { success: false, message: 'User not found.' };
  }
}

module.exports = new UserService();
