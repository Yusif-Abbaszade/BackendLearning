import express from "express";

import { PORT } from './config/env.js';

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";

import connectToDatabase from "./database/mongodb.js";

const app = express();


app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/subscriptions', subscriptionRouter);

app.get('/', (req, res) => {
    res.send('salam')
})


app.listen(PORT, async () => {
    console.log(`App listening on port ${PORT}`);

    await connectToDatabase();
})

export default app;