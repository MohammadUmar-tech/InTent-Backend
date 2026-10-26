import express from 'express'
import dotenv from 'dotenv'
import { connectDb } from './src/config/db_connect.js'
dotenv.config()
connectDb
const app=express()
const port=process.env.PORT||8000

await connectDb(process.env.DATABASE_URL)





app.listen(port,()=>{
    console.log(`Servver started at port ${port}`)
})