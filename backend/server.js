require('dotenv').config(); // load ev var front .env file
const express = require('express')
const mongoose = require('mongoose'); 



const app = express(); // nothing but thr creating the instance of express
const cors = require('cors'); // <--- NEW LINE 1 (Import it)


const jobsRouter = require('./routes/jobs');
const authRouter = require('./routes/auth');
const authenticateUser = require('./middleware/authentication');
// middlaware 


app.use(express.json());
app.use(cors()); // <--- NEW LINE 2 (Use it - allow everyone)

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("Mongodb connected");
})
.catch((err)=>{
    console.log("mongo db erreo: ",err);
})

app.use('/api/v1/jobs',authenticateUser, jobsRouter);
app.use('/api/v1/auth',authRouter);

app.get('/' , (req,res)=>{
    res.send('API is runnign');
});

const port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`server is runnig at ${port}`);
});
