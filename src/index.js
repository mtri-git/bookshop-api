const express = require('express')
const dotenv = require('dotenv')
const db = require('./configs/dbConfig')
//set up express
const app = express()
const route = require('./route/index')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')

app.use(cors())

// {
//     origin: ['http://127.0.0.1:5173/', 'http://localhost:5173/', 'http://127.0.0.1:5174/'],
//     credentials:true,
// }

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser())


dotenv.config()

//log morgan
// if (app.get('env') == 'production') {
// 	const accessLogStream = fs.createWriteStream(
// 		path.join(__dirname, '..', 'logs', 'access.log'),
// 		{ flags: 'a' }
// 	)
// 	app.use(morgan({ stream: accessLogStream }))
// } else {
// 	app.use(morgan('dev')) //log to console on development
// }

app.use(morgan("default"))

// connect DB
db.dbConnect()

app.get('/', (req, res) => {
    res.json({message: "Hello how are you?"})
})


route(app)

const PORT = process.env.PORT || 3001;
  
app.listen(PORT,() => {
    console.log(`Running on PORT ${PORT}...`);
})
