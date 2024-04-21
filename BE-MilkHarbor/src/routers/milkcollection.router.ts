import { Router } from 'express'
import asynceHandler from 'express-async-handler'
import { MilkCollection, milkCollectionModel } from '../models/milk_collection.model'
import { HTTP_BAD_REQUEST } from '../constants/http';
import * as ExcelJS from 'exceljs';
import * as json2csv from 'json2csv';
import { transporter } from '../constants/mailSender';
const mcRouter = Router()

mcRouter.post("/collect", asynceHandler(
    async (req, res) => {
        try {
            // Extracting required fields from the request body
            const { f_id, username, email, milk_qnt, status, milk_lac_deg, milk_fat, milk_snf, price_per_liter, total } = req.body;

            // Create a new MilkCollection document
            const newMc: MilkCollection = {
                milk_coll_id: '', // Generate or assign a unique ID here if needed
                f_id,
                username,
                email,
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

            const mailOptions = {
                from: 'milkharbor78@gmail.com',
                to: email,
                subject: 'Supply Milk Details',
                text:
                    'Dear ' + username + ', \n' +
                    'We are writing to confirm the details of the milk supply you provided on today.\n' + ' Thank you for your continued support in supplying high-quality milk to our dairy. \n' +
                    'Here are the details of your recent milk supply: \n' +
                    'Quantity: ' + milk_qnt + ' liters, \n' +
                    'Lactose Degree: ' + milk_lac_deg + '%, \n' +
                    'Fat Content: ' + milk_fat + '%, \n' +
                    'SNF: ' + milk_snf + '%, \n' +
                    'Price per Liter: ₹' + price_per_liter.toFixed(2) + ', \n' +
                    'Total Cost: ₹' + (milk_qnt * price_per_liter).toFixed(2) + '\n' +
                    'Your consistent supply of quality milk is invaluable to us, and we truly appreciate your dedication and hard work. \n' +
                    'If you have any questions or concerns regarding this supply or any other matter, please don\'t hesitate to contact us. We are here to assist you in any way we can. \n' +
                    'Thank you once again for your partnership. We look forward to continuing our collaboration for mutual success. \n' +
                    'Best regards, \n' +
                    'MilkHarbor Team'
            };

            transporter.sendMail(mailOptions);
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

// get total payment for farmer those payment is pending
mcRouter.post('/getByFId', asynceHandler(
    async (req, res) => {
        try {
            const { f_id } = req.body;
            const data = await milkCollectionModel.find({ f_id, status: "PENDING" })
            res.status(200).json(data);

        } catch (error) {
            console.error("Error:", error);
            // Send error response
            res.status(500).json({ error: "Internal server error" });
        }
    }
));

// get supply milk details
mcRouter.get('/getByFId/:f_id', asynceHandler(
    async (req, res) => {
        try {
            const f_id = req.params.f_id;
            const data = await milkCollectionModel.find({ f_id })
            res.status(200).json(data);

        } catch (error) {
            console.error("Error:", error);
            // Send error response
            res.status(500).json({ error: "Internal server error" });
        }
    }
));

mcRouter.post('/getById', asynceHandler(
    async (req, res) => {
        try {
            const { _id } = req.body;
            const data = await milkCollectionModel.find({ _id })
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

    const data = await milkCollectionModel.find({ f_id: f_id, status: "PENDING" });
    const updateResult = await milkCollectionModel.updateMany(
        { f_id: f_id },
        { $set: { status: "DONE" } },
        { new: true }
    );
    if (updateResult.modifiedCount >= 1) {
        const updatedIds = data.map(id => id._id);
        res.send(updatedIds);
    } else {
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
        if (data) {
            res.status(200).send(data);
        } else {
            res.status(400).send(false)
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});


mcRouter.get("/getSevenDayData/:username", asynceHandler(
    async (req, res) => {
        try {
            const username=req.params.username;
            const currentDate = new Date();
            const sevenDaysAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);

            const query = { 
                username: username,
                createdAt: { $gte: sevenDaysAgo, $lte: currentDate 
                } };
            const milkCollections = await milkCollectionModel.find(query);
            // Send success response
            res.status(200).send(milkCollections);
        } catch (error) {
            console.error("Error:", error);
            // Send error response
            res.status(500).json({ error: "Internal server error" });
        }
    }
))

export default mcRouter;
