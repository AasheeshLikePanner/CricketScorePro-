import express from 'express';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import BallRouter from './routes/Ball.route';
import MatchRouter from './routes/Match.route';
dotenv.config()

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ["POST", "GET"],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.json("This is great");
});

app.use('/ball', BallRouter)
app.use('/match', MatchRouter)

export default app;
