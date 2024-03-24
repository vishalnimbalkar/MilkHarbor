import {Router} from 'express'
import asynceHandler from 'express-async-handler'
import { MilkCollection, milkCollectionModel } from '../models/milk_collection.model'
import { HTTP_BAD_REQUEST } from '../constants/http';
import * as ExcelJS from 'exceljs';
const mcRouter= Router()


mcRouter.post("/collect", asynceHandler(
    async (req, res) => {
    try {
        // Extracting required fields from the request body
        const { f_id, username, milk_qnt,milk_lac_deg, milk_fat, milk_snf, price_per_liter, total } = req.body;
    
        // Create a new MilkCollection document
        const newMc: MilkCollection = {
            milk_coll_id: '', // Generate or assign a unique ID here if needed
            f_id,
            username,
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


mcRouter.get("/get",asynceHandler(
    async (req, res)=>{
        try {
            const milkCollections=await milkCollectionModel.find();
            // Send success response
            res.status(200).send(milkCollections);
        } catch (error) {
            console.error("Error:", error);
            // Send error response
            res.status(500).json({ error: "Internal server error" });
        }
    }
))

mcRouter.post("/delete", asynceHandler(
    async (req, res)=>{
        try {
            const {_id} = req.body;
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

mcRouter.get('/download-excel', async (req, res) => {
    try {
      // Fetch data from MongoDB
      const data = await milkCollectionModel.find({});
  
      // Create a new Excel workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Sheet1');
  
      // Extract headers from the first document
      const headers = Object.keys(data[0]);
  
      // Set headers in the worksheet
      worksheet.addRow(headers);
  
      // Add data rows to the worksheet
      data.forEach((item: any) => {
        const row: any = [];
        headers.forEach((header) => {
          row.push(item[header]);
        });
        worksheet.addRow(row);
      });
  
      // Set response headers to trigger file download
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=example.xlsx');
  
      // Send the Excel file to the client
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  

export default mcRouter;
