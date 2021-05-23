const _user = require("../models/user").userModel;

const checkUser = async (userInfo) => {
  let userData;
  try {
    const filter = { user_id: userInfo.user_id };
    userData = await _user.findOneAndUpdate(filter, {
      $inc: { usageCount: 1 },
      useFindAndModify: false,
    });
  } catch (e) {
    throw new Error(e);
  }
  return userData;
};

const createUser = async (userInfo) => {
  try {
    await _user.create(userInfo);
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = {
  createUser,
  checkUser,
};
