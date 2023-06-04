import User from '../models/UserSchema.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const getAuth = async (req, res, next) => {
    try {        
        const token = req.headers.token;
        if (!token) {
            res.status(401).json({error: "Unauthorized"});
        }
        else {
            const verifyToken = jwt.verify(token, process.env.SECRET);
            if (!verifyToken) {
                res.status(401).json({error: "Unauthorized"});
            }
            else {
                const auth = await User.findById(verifyToken.id);
                
                req.userId = verifyToken.id;
                req.auth = auth;
                next();
            }
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({error: "Unauthorized"})
    }}

export default getAuth;