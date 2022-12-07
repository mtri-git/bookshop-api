const jwt = require('jsonwebtoken');
// const promisify = require('util').promisify;
require("dotenv").config();


// generate Access Token and Refresh token
const generateAllToken = (user) => {
	try {
		const accessToken = jwt.sign( user, process.env.ADMIN_ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_LIFE})
        const refreshToken = jwt.sign(user, process.env.ADMIN_REFRESH_TOKEN_SECRET, {expiresIn:process.env.REFRESH_TOKEN_LIFE})
		
		return {
            accessToken: accessToken,
            refreshToken: refreshToken
        }

	} catch (error) {
		console.log(`Error in generate access token:  + ${error}`);
		return null;
	}
}

// generate a single access token
const generateAccessToken = (user) => {
	try {
		const accessToken = jwt.sign( user, process.env.ADMIN_ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_LIFE})
		
		return {
            accessToken: accessToken
        }

	} catch (error) {
		console.log(`Error in generate access token:   ${error}`);
		return null;
	}
}

const verifyToken = (type='access' ,token) => {
	try {
		if(type === 'access')
        	return jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET)
		else if(type === 'refresh')
			return jwt.verify(token, process.env.ADMIN_REFRESH_TOKEN_SECRET)

	} catch (error) {
		console.log(`${error}`);
		return  null
	}
}

module.exports = {generateAllToken, verifyToken, generateAccessToken}