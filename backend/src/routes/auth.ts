import {Router} from 'express'
import type {Request, Response} from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import pool from '../db.js'
import { hash } from 'crypto'

const router = Router()

router.post('/signup', async (req: Request, res: Response) =>{
    const {username, email, password} = req.body
    try{
        const hashedPassword = await bcrypt.hash(password, 10)
        const result = await pool.query('insert into users (username, email, password) values ($1, $2, $3) RETURNING id, username, email', [username, email, hashedPassword])
        res.status(201).json(result.rows[0])
    } catch (err: any){
        console.error(err)
        res.status(500).json({error: 'user already exists or db error'})
    }
})

router.post('/login', async(req: Request, res: Response)=>{
    const {email, password} = req.body;
    try{
        const result = await pool.query('select * from users where email = $1', [email])
        const user = result.rows[0]
        if(!user) return res.status(400).json({error: 'invalid credentials'})
        const valid = await bcrypt.compare(password, user.password)
        const token = jwt.sign(
            {id: user.id, email: user.email},
            process.env.JWT_SECRET || 'secretkey',
            {expiresIn: '2h'}
        )
        res.json({token})
    } catch (err: any){
        console.log(err)
        res.status(500).json({error: "db error"})
    }
})
export default router