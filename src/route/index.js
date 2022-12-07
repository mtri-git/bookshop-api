const authRouter = require('./auth.route')
const bookRouter = require('./book.route')
const userRouter = require('./user.route')
const orderRouter = require('./order.route')
const adminRouter = require('./admin')

const route = (app) => {

    // client API
    app.use('/auth', authRouter)
    app.use('/book', bookRouter)
    app.use('/user', userRouter)
    app.use('/order', orderRouter)
    app.use('/admin', adminRouter)

    // Admin API
    // app.use('/admin/user')
    // app.use('/admin/book')
    // app.use('/admin/category')
    // app.use('/admin/order')
    // app.use('/admin/publisher')
}

module.exports = route