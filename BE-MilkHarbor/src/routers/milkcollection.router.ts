import {Router} from 'express'
import asynceHandler from 'express-async-handler'
import { milkCollectionModel } from '../models/milk_collection.model'
const mcRouter= Router()

const data= {
    f_id:"3`2846912376",
    milk_fat:23,
    milk_qnt:23,
    milk_snf:43,
    price_per_liter:24,
    total:200
}
mcRouter.get("/getAll",asynceHandler(
    async (req, res)=>{
    const milkCollections=await milkCollectionModel.find();
    res.send(milkCollections)
    }
))

export default mcRouter;
