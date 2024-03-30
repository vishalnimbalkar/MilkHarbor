import { Router } from 'express'
import asynceHandler from 'express-async-handler'
import { MilkCollection, milkCollectionModel } from '../models/milk_collection.model'
import { HTTP_BAD_REQUEST } from '../constants/http';
import * as ExcelJS from 'exceljs';
import * as json2csv from 'json2csv';
const mcRouter = Router()


mcRouter.post("/collect", asynceHandler(
    async (req, res) => {
        try {
            // Extracting required fields from the request body
            const { f_id, username, milk_qnt, status, milk_lac_deg, milk_fat, milk_snf, price_per_liter, total } = req.body;

            // Create a new MilkCollection document
            const newMc: MilkCollection = {
                milk_coll_id: '', // Generate or assign a unique ID here if needed
                f_id,
                username,
                status,
                milk_qnt,
                milk_lac_deg,
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


mcRouter.get("/get", asynceHandler(
    async (req, res) => {
        try {
            const milkCollections = await milkCollectionModel.find();
            // Send success response
            res.status(200).send(milkCollections);
        } catch (error) {
            console.error("Error:", error);
            // Send error response
            res.status(500).json({ error: "Internal server error" });
        }
    }
))

// get total payment for farmer
mcRouter.post('/getById', asynceHandler(
    async (req, res) => {
        try {
            const { f_id } = req.body;
            const data=await milkCollectionModel.find({f_id, status:"PENDING"})
                res.status(200).json(data); 
           
        } catch (error) {
            console.error("Error:", error);
            // Send error response
            res.status(500).json({ error: "Internal server error" });
        }
    }
));


mcRouter.post('/updateAll', asynceHandler(async (req, res) => {
    const { f_id } = req.body;
  
    const data=await milkCollectionModel.find({f_id:f_id, status:"PENDING"});
    const updateResult = await milkCollectionModel.updateMany(
      { f_id: f_id },
      { $set: { status: "DONE" } },
      { new: true }
    );
    if (updateResult.modifiedCount >= 1) {
        const updatedIds=data.map(id=>id._id);
        res.send(updatedIds);
      }else {
      res.status(HTTP_BAD_REQUEST).send(false);
    }
  }));
  

mcRouter.post("/delete", asynceHandler(
    async (req, res) => {
        try {
            const { _id } = req.body;
            // Extracting required fields from the request body
            const deleteResult = await milkCollectionModel.deleteOne(
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

mcRouter.get('/report', async (req, res) => {
    try {
        // Fetch data from MongoDB
        const data = await milkCollectionModel.find({});
        if(data){
            res.status(200).send(data);
        }else{
            res.status(400).send(false)
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

export default mcRouter;

// logic to download csv file from nodejs
// mcRouter.get('/report', async (req, res) => {
//     try {
//         let collectionData:any[]= [];

//         // Fetch data from MongoDB
//         const data = await milkCollectionModel.find({});

//         data.forEach(ele => {
//             let { username, milk_fat, milk_qnt, milk_lac_deg, milk_snf, price_per_liter, total } = ele;
//             collectionData.push({ username, milk_fat, milk_qnt, milk_lac_deg, milk_snf, price_per_liter, total });
//         });

//         const csvData = json2csv.parse(collectionData);

//         res.setHeader('Content-Type', 'text/csv');
//         res.setHeader('Content-Disposition', 'attachment; filename=MilkCollectionReport.csv');
//         res.status(200).end(csvData);
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });