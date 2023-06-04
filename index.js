import express from 'express';
import "./db/database.js";
import userRouter from './routes/user.js';
import contactRouter from './routes/contact.js';
import cors from "cors";

const PORT = process.env.PORT || 8000;
const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/user', userRouter);
app.use('/api/contact', contactRouter);

app.get('/', (req, res) => {
    res.send('This is app');
})

app.listen(8000, () => {
    console.log('Running on 8000');
});