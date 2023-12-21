const keyTokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey }) => {
    try {
      const publicKeyString = publicKey.toString(); // publicKey generate by crypto as buffer, -> toString to save to db
      const tokenCreate = await keyTokenModel.create({
        user: userId,
        publicKey: publicKeyString
      });
      return tokenCreate ? tokenCreate.publicKey : null;
    } catch (error) {

    }
  }
}

module.exports = KeyTokenService;