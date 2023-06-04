import express from 'express';
import User from '../models/UserSchema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import getAuth from '../middleware/auth.js';

const userRouter = express.Router();
userRouter.use(express.json());

userRouter.get('/', async (req, res) => {
    await User.find().then((res) => {
        res.status(200).json({msg: User})
    }).catch(err => {
        res.status(400).json({error: err});
    }) 
})

userRouter.post('/register', async (req, res) => {
    
    try {
        const {name, email, password} = req.body;
        if (name && email && password) {
            const hashPassword = await bcrypt.hash(password, 10);
            const user = await User.create({name, email, password: hashPassword});

            res.status(200).json({msg: "User Registered Successfully", user: user});
        }
    } catch (err) {
        res.status(400).json({error: err});
    }
})

userRouter.post('/login', async (req, res) => {

    try {
        const {email, password} = req.body;
        if (email && password) {
            const existingUser = await User.findOne({email});
            if (!existingUser) {
                res.status(401).json({msg: "User not found"});
            }
            else {
                const comparePassword = await bcrypt.compare(password, existingUser.password);
                if (!comparePassword) {
                    res.status(401).json({msg: "Wrong Credentials"});
                }
                else {
                    const token = jwt.sign({id: existingUser._id}, process.env.SECRET);
                    res.status(200).json({msg: "Login Successfully", token: token});
                }
            }
        }
    }
    catch (err) {
        console.log(err);
    }
})

userRouter.get("/auth", getAuth, (req, res) => {
    res.status(200).json(req.auth);
})

export default userRouter;