const express = require('express')
const app = express();
const db = require('./db')
require('dotenv').config();


const bodyParser =require('body-parser');
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000

// const {jwtAuthMiddleware} = require('./Jwt')

const userRoutes = require('./routes/UserRoutes');
const candidateRoutes = require('./routes/CandidatesRoutes');

// Use the routers
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);

app.listen(PORT,()=>{
    console.log('listening on port 3000');
}) 
