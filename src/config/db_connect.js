import mongoose from "mongoose";

export const connectDb=async (url)=>{
try {
    const connect=await mongoose.connect(url)
    if(connect){
        console.log(`DATEBASE connected successfully`)
    }
} catch (error) {
    console.log(`Database connection error :${error}`)
}
}