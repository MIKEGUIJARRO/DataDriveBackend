const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const colors = require('colors');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');

const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error');
const User = require('./models/User');

//Pendiente de ver
https://www.youtube.com/watch?v=7K9kDrtc4S8

//Load env vars
dotenv.config({ path: './config/config.env' });

// Loads auth Config
require('./auth');
const cookieSession = require('cookie-session');

//Routes
const powerStudentsRoute = require('./routes/powerschool/students');
const authRoute = require('./routes/auth');
const driveRoute = require('./routes/drive');

// Connect to DB
connectDB();

const app = express();


// Body Parser
app.use(express.json());

// Log Dev Dependencies
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Cookies
app.use(cookieSession({
    name: 'datadrive',
    keys: ['dd'],
    maxAge: 24 * 60 * 60 * 100,
    secret: 'stackoverflow',
    sameSite: 'none'
}));

// Passport Config
app.use(passport.initialize());
app.use(passport.session());

// Cors Config
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));

//passport.use(User.createStrategy())

// Routes
app.use('/api/v1/students', powerStudentsRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/drive', driveRoute);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on PORT ${PORT}`.yellow.bold);
})