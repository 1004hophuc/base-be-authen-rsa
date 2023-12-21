'use strict'
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const shopModel = require("../models/shop.model");
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getIntoData } = require('../utils');

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      // step1: check email exist??
      const shop = await shopModel.findOne({ email }).lean() // if do not include .lean(), return object of mongoose when query, it's very heavy, when have .lean(), decrease object to light

      if (shop) {
        return {
          code: 'xxx',
          message: 'Shop already registered!'
        };
      };

      const passwordHash = await bcrypt.hash(password, 10);

      const newShop = await shopModel.create({
        name, email, password: passwordHash, roles: RoleShop.SHOP
      });

      // generate publickey and private key token using RSA
      // using package crypto
      if (newShop) {
        // create privatekey and publickey, private forward for user, public save to db to verify
        // privatekey use for sign token, public key use for verify token (increase security if using two key for verify)
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
          },
          privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
          }
        });
        // pkcs1 Public Key CryptoGraphy Standards!

        // save publicKey to db
        const publicKeySaveToDb = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey
        });

        if (!publicKeySaveToDb) {
          return {
            code: 'xxxx',
            message: 'publicKeyString error!'
          }
        }

        // after convert to string to save db, the publicKey need to revert to object to verify with JWT
        const publicKeyObject = crypto.createPublicKey(publicKeySaveToDb)
        console.log('publicKeyObject:', publicKeyObject)

        // created token pair
        const tokenPair = await createTokenPair({ userId: newShop._id, email }, publicKeyObject, privateKey);
        console.log(`Create tokens success::: `, tokenPair);

        return {
          code: 201,
          metadata: getIntoData({ fields: ['_id', 'name', 'email'], object: newShop }),
          tokenPair
        }
      };


    } catch (error) {
      return {
        code: 'xxx',
        message: error.message,
        status: 'error'
      }
    }
  }
}

module.exports = AccessService;