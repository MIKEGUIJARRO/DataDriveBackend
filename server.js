const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const colors = require('colors');
const cors = require('cors');

const errorHandler = require('./middlewares/error');

//Load env vars
dotenv.config({path: './config/config.env'});


//Routes
const powerStudents = require('./routes/powerschool/students');

const app = express();

app.use(cors({
    origin:'http://localhost:3000'
}));

// Body Parser
app.use(express.json());

// Log Dev Dependencies
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.use('/api/v1/students', powerStudents);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, ()=> {
    console.log(`Server running in ${process.env.NODE_ENV} mode on PORT ${PORT}`.yellow.bold);
})