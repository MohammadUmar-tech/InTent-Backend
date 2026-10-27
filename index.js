import express from 'express'
import dotenv from 'dotenv'
import { connectDb } from './src/config/db_connect.js'
dotenv.config()
import authRouter from './src/routes/auth.routes.js'
connectDb
const app=express()
const port=process.env.PORT||8000
await connectDb(process.env.DATABASE_URL)
app.use('/api/auth',authRouter)
app.listen(port,()=>{
    console.log(`Server started at port ${port}`)
})