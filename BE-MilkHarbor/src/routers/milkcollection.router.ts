import {Router} from 'express'
import asynceHandler from 'express-async-handler'
import { MilkCollection, milkCollectionModel } from '../models/milk_collection.model'
import { userModel } from '../models/user.model'
const mcRouter= Router()

const data= {
    f_id:"3`2846912376",
    milk_fat:23,
    milk_qnt:23,
    milk_snf:43,
    price_per_liter:24,
    total:200
}

mcRouter.post("/collect", asynceHandler(
    async (req, res) => {
    try {
        // Extracting required fields from the request body
        const { f_id, milk_qnt, milk_fat, milk_snf, price_per_liter, total } = req.body;
    
        // Create a new MilkCollection document
        const newMc: MilkCollection = {
            milk_coll_id: '', // Generate or assign a unique ID here if needed
            f_id,
            milk_qnt,
            milk_fat,
            milk_snf,
            price_per_liter,
            total
        };

        // Save the new MilkCollection document to the database
        await milkCollectionModel.create(newMc);

        // Send success response
        res.status(200).send(true);
    } catch (error) {
        console.error("Error:", error);
        // Send error response
        res.status(500).json({ error: "Internal server error" });
    }
}));

mcRouter.get("/getAll",asynceHandler(
    async (req, res)=>{
    const milkCollections=await milkCollectionModel.find();
    res.send(milkCollections)
    }
))

export default mcRouter;
