const express = require('express');
const router = express.Router();
const User= require('./../models/User')
const {jwtAuthMiddleware,generateToken} = require('../Jwt');

//post route to and a person
router.post('/signup',async (req,res)=>{

    try{
        const data = req.body

        const newUser = new User(data);
        const response = await newUser.save();
        console.log('data saved');

        const payload = {
            id: response.id
        }
        console.log(JSON.stringify(payload))
        const token  = generateToken(payload);
        console.log('token is :', token);
        res.status(200).json({response:response, token:token});

    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal server error'});
    }
})

// Login Route
router.post('/login', async(req, res) => {
    try{
        // Extract username and password from request body
        const {addharCard, password} = req.body;

        // Find the user by username
        const user = await User.findOne({addharCard: addharCard});

        // If user does not exist or password does not match, return error
        if( !user || !(await user.comparePassword(password))){
            return res.status(401).json({error: 'Invalid username or password'});
        }

        // generate Token 
        const payload = {
            id: user.id,
        }
        const token = generateToken(payload);

        // resturn token as response
        res.json({token})
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/profile',jwtAuthMiddleware, async (req,res)=>{
    try{
        const userdata = req.user//getting this from token
        const userid = userdata.id;
        const user = await User.findById(userid);
        res.status(200).json({user}); 
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal server error'});
    }
})



router.put('/profile/password',jwtAuthMiddleware, async (req,res)=>{
    try{
        const userid = req.user.id;//extract the id from the token
        const {currentPassword,newPassword} =req.body; 

         // Find the user by username
         const user = await User.findById(userid);

          // If password does not match, return error
        if(!(await user.comparePassword(currentPassword))){
            return res.status(401).json({error: 'Invalid username or password'});
        }

        //update the user password

        user.pasword = newPassword;
        await user.save();

        console.log('password updated');
        res.status(200).json({message: "password updated"});
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal server error'}); 
    }
})

module.exports = router;
