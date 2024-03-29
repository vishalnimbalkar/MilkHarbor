import express from 'express'
import cors from 'cors'
import userRouter from './routers/user.router'
import {main} from './connect'
import mcRouter from './routers/milkcollection.router';
import aRouter from './routers/advance.router';
import paymentRouter from './routers/payment.router';

main().catch(err => console.error(err));
const app = express();
app.use(express.json());
app.use(cors({
    credentials:true,
    origin:["http://localhost:4200"]
}));

const port = 5000;
app.listen(port, () => {
    console.log("Website served on http://localhost:" + port);
})

app.use("/users", userRouter)
app.use("/mc", mcRouter)
app.use("/advance", aRouter)
app.use("/payment", paymentRouter)
