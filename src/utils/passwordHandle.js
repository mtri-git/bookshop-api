const bcrypt = require('bcrypt')

const hashPassword = (password) => {

    const salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(password, salt)
}

const verifyHash = (password ,hash) => {
    return bcrypt.compareSync(password, hash)
}

module.exports = {hashPassword, verifyHash}