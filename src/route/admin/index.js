const express = require('express')
const router = express.Router()
const userRouter = require('./user.route')
const authRouter = require('./auth.route')
const bookRouter = require('./book.route')
const statisticRouter = require('./statistic.route')
const orderRouter = require('./order.route')

router.use('/user', userRouter)
router.use('/auth', authRouter)
router.use('/book', bookRouter)
router.use('/order', orderRouter)
router.use('/statistic', statisticRouter)


module.exports = router