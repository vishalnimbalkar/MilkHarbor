import { Router } from 'express'
import asynceHandler from 'express-async-handler'
import { Advance, AdvanceModel } from '../models/advance.module';
import { HTTP_BAD_REQUEST } from '../constants/http';

const aRouter = Router()

aRouter.post('/add', asynceHandler(
    async (req, res)=>{
        try {
            const { username, status,type, descp, amount} = req.body;
            const advance: Advance = {
                id: '',
                type,
                status,
                amount,
                username,
                descp
            }
            await AdvanceModel.create(advance)
            // Send success response
            res.status(200).json({ success: true });
        } catch (error) {
            console.error("Error:", error);
            // Send error response
            res.status(500).json({ error: "Internal server error" });
        }
    }
))


aRouter.get("/get", asynceHandler(
    async (req, res) => {
        const advances = await AdvanceModel.find({});
        if (advances) {
            res.status(200).send(advances)
            return;
        } else {
            res.status(200).send(false)
            return;
        }
    }
))

aRouter.post('/getByUname', asynceHandler(
    async (req, res) => {
        try {
            const { username } = req.body;

           const data=await AdvanceModel.find({username, status:"PENDING"})
           if(data){
            res.status(200).json(data); 
        }else{
            res.send(false).json();
        }
        } catch (error) {
            console.error("Error:", error);
            // Send error response
            res.status(500).json({ error: "Internal server error" });
        }
    }
));

aRouter.post('/getById', asynceHandler(
    async (req, res) => {
        try {
            const { _id } = req.body;
            const data=await AdvanceModel.find({_id})
                res.status(200).json(data); 
           
        } catch (error) {
            console.error("Error:", error);
            // Send error response
            res.status(500).json({ error: "Internal server error" });
        }
    }
));

aRouter.get('/getByUsername/:username', asynceHandler(
    async (req, res) => {
        try {
            const username  = req.params.username;
            const data=await AdvanceModel.find({username})
                res.status(200).json(data); 
           
        } catch (error) {
            console.error("Error:", error);
            // Send error response
            res.status(500).json({ error: "Internal server error" });
        }
    }
));

aRouter.post("/delete", asynceHandler(
    async (req, res) => {
        try {

            const { _id } = req.body;
            // Extracting required fields from the request body
            const deleteResult = await AdvanceModel.deleteOne(
                { _id: _id }
            );
            // Check for successful update (modifiedCount should be 1)
            if (deleteResult.deletedCount === 1) {
                res.send(true); // Send success message
            } else {
                res.status(400).send(false); // Send failure message
            }
        } catch (error) {
            console.error("Error:", error);
            // Send error response
            res.status(500).json({ error: "Internal server error" });
        }
    }
))


aRouter.post('/updateAll', asynceHandler(
    async (req, res)=>{
        
        const {username}=req.body
        const data=await AdvanceModel.find({username, status:"PENDING"});
        const updateResult= await AdvanceModel.updateMany({username}, {status:"DONE"} )
        if (updateResult.modifiedCount >= 1) {
            const updatedIds=data.map(id=>id._id);
            res.send(updatedIds);
        } else {
            res.status(HTTP_BAD_REQUEST).send(false); // Send failure message
        }
        
    }
))

export default aRouter;

