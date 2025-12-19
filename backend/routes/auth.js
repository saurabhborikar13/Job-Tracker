
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// register

router.post('/register', async (req,res)=>{
   
    try{
        const {name,email,password} = req.body;
        //  console.log('User Model is:');
        const user = await User.create({name,email,password});
         console.log('User Model is:', user);
        const token = jwt.sign(
            {
                userId:user._id, name:user.name
            },
            'secret123',
            {
                expiresIn:'30d'
            }
        );

        res.status(201).json({user:{name : user.name},token});
    }
    catch(e){
        res.status(500).json({msg: e.message});
    }
});


// login
router.post('/login',async(req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email});

        if(user === null){
            return res.status(401).json({msg:'Invalid Credentials'}); 
        }

        const isPassCorrect = await bcrypt.compare(password,user.password);
        if(!isPassCorrect){
             return res.status(401).json({msg:'Invalid Credentials'}); 
        }

        const token = jwt.sign(
            {
            userId: user._id,name:user.name
            },
            'secret123',
            {
                expiresIn:'30d'
            }

        );

        res.status(200).json({ user: { name: user.name }, token });
    }
    catch (error) {
    res.status(500).json({ msg: error.message });
    }
});

module.exports = router;
