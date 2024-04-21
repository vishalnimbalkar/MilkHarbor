import { Router } from 'express'
import asynceHandler from 'express-async-handler'
import { Payment, PaymentModel } from '../models/payment.module';
const paymentRouter = Router()

// const payload = {
//     payment_amount: supplyTotal,
//     f_id:this.selectedId,
//     status:'SUCCESS',
//     a_id:a_ids,
//     milk_coll_id:milk_coll_ids
//   }  
paymentRouter.post('/create', asynceHandler(
    async (req, res)=>{
        try {
            const { payment_amount,username,status, f_id,a_id, milk_coll_id} = req.body;
            const payment: Payment = {
                id: '',
                payment_amount,
                f_id,
                username,
                a_id,
                milk_coll_id,
                status
            }
            await PaymentModel.create(payment)
            // Send success response
            res.status(200).json({ success: true });
        } catch (error) {
            console.error("Error:", error);
            // Send error response
            res.status(500).json({ error: "Internal server error" });
        }
    }
))

paymentRouter.get('/get', asynceHandler(
    async (req, res)=>{
        try {
           const data= await PaymentModel.find({})
            // Send success response
            res.status(200).send(data);
        } catch (error) {
            console.error("Error:", error);
            // Send error response
            res.status(500).json({ error: "Internal server error" });
        }
    }
))

paymentRouter.get('/getByUsername/:username', asynceHandler(
    async (req, res)=>{
        try {
            const username=req.params.username;
           const data= await PaymentModel.find({username})
            // Send success response
            res.status(200).send(data);
        } catch (error) {
            console.error("Error:", error);
            // Send error response
            res.status(500).json({ error: "Internal server error" });
        }
    }
))



export default paymentRouter;
