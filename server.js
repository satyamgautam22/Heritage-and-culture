import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import clerkWebhooks from './controllers/webhooks.js';
import connectDB from './config/mongodb.js';



const app = express();
//connect db
await connectDB();
//middle ware
app.use(cors());


//Routes
app.get('/', (req, res) => {
    res.send('api working');
})
app.post('/clerk',express.json(),clerkWebhooks);




//port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running ${PORT}`);
})