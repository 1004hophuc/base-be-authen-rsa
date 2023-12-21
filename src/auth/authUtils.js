'use strict'

const JWT = require('jsonwebtoken');

const createTokenPair = async (payload, publicKey, privateKey) => {
  console.log('payload:', payload)
  console.log('publicKey:', publicKey)
  try {
    // create access token and refresh token
    const accessToken = await JWT.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '2 days'
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '2 days'
    });

    // verify using publicKey have saved to db
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log(`Error verify::: `, err);
      } else {
        console.log(`Decode verify::: `, decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {

  }
};

module.exports = {
  createTokenPair
}