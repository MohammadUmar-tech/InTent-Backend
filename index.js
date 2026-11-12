import express from 'express'
import dotenv from 'dotenv'
import { connectDb } from './src/config/db_connect.js'
dotenv.config()
import authRouter from './src/routes/auth.routes.js'
import cookieParser from 'cookie-parser'
connectDb
const app=express()
await connectDb(process.env.DATABASE_URL)
const port=process.env.PORT||8000
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth',authRouter)
app.listen(port,()=>{
    console.log(`Server started at port ${port}`)
})