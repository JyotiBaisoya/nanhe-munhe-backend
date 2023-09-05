const express = require("express");
const {connection}  = require("./config/dbconnection");
const userRouter = require("./Routes/userRoute");
const authenticateToken = require("./middleware/authenticator");
const productRouter = require("./Routes/productRoute");
const cartRouter = require("./Routes/cartRoute");
const cors = require('cors');
const orderRouter = require("./Routes/order");
const reviewRouter = require("./Routes/reviewRoute");
require('dotenv').config();
const app =express();
app.use(cors())
app.use(express.json())


app.use("/user",userRouter)
app.use("/api",productRouter);
app.use("/api",cartRouter);
app.use("/api",orderRouter);
app.use("/api/review",reviewRouter)

app.get("/",async(req,res)=>{
    try {
        res.send("Home Page")
    } catch (error) {
        console.log(error)
    }
})

app.get("/authcheck",authenticateToken,(req,res)=>{

        res.send({"msg":"autho working fine",user:req.user})

})


app.listen(process.env.port,async()=>{
  try {
    console.log("Running on the port 4500")
    await connection;
    console.log("connected to db")
  } catch (error) {
     console.log(error)
  }
   
})