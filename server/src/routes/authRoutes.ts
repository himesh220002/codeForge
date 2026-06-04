import express from 'express';
import bcrypt from 'bcrypt';
import { UserModel } from '../models/user.js';
import { verifyUserCredentials, issueTokens } from '../services/authService.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await verifyUserCredentials(email, password);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const { accessToken, refreshToken } = await issueTokens(user.id, user.role);

        const isProd = process.env.NODE_ENV === 'production';
        const cookie = `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=608400; SameSite=Lax${isProd ? '; Secure' : ''}`;

        res.setHeader('Set-Cookie', cookie);

        // Return access token in response body
        return res.status(200).json({ 
            message: 'Login successful',
            accessToken,
            role: user.role,
            name: user.name
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

// POST /api/auth/signup
router.post('/signup', async (req, res)=> {
    const {name, email, password} = req.body;

    try {
        const existingUser = await UserModel.findOne({email});
        if(existingUser){
            return res.status(400).json({message: 'Email already in use'});
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new UserModel({
            name,
            email,
            passwordHash,
            role: 'user',
            createdAt: new Date(),
        });
        
        await newUser.save();

        //isssue tokens immediately after signup
        const { accessToken, refreshToken} = await issueTokens(
            newUser.id,
            newUser.role
        );

        const isProd = process.env.NODE_ENV === 'production';
        const cookie = `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=608400; SameSite=Lax${isProd ? '; Secure' : ''}`;

        res.setHeader('Set-Cookie', cookie);

        return res.status(201).json({message: 'Signup successful',
            accessToken,
            role: newUser.role,
            name: newUser.name
        });
    }catch(error){
        return res.status(500).json({message: 'Internal Server Error'});
    }
});

export default router;
        
