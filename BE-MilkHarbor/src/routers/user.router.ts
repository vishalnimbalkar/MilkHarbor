import { Router } from 'express'
import asynceHandler from 'express-async-handler'
import { User, userModel } from '../models/user.model'
import { HTTP_BAD_REQUEST, API_KEY } from '../constants/http'
import { transporter } from '../constants/mailSender'

const router = Router()

router.post("/register", asynceHandler(
    async (req, res) => {
        try {
            const { name, address, m_no, email, username, password, role, status, is_active } = req.body;
            const user = await userModel.findOne({ m_no });
            if (user) {
                res.send(false);
                return;
            }
            const newUser: User = {
                id: '',
                name,
                email,
                address,
                m_no,
                username,
                password,
                role,
                status,
                is_active
            }
            await userModel.create(newUser);
            // Send success response
            res.send(true);
        } catch (error) {
            res.send(false);
        }
    }
));


router.post("/login", asynceHandler(
    async (req, res) => {
        const { m_no, password } = req.body;
        const user = await userModel.findOne({
            $or: [
                { m_no: m_no },
                { email: m_no },
                { username: m_no }
            ], password
        });
        if (user) {
            res.status(200).send(user)
            return;
        } else {
            res.status(200).send(false)
            return;
        }
    }
))

router.get("/getUser/:m_no", asynceHandler(
    async (req, res) => {
        const m_no = req.params.m_no;
        const user = await userModel.findOne({ m_no });
        if (user) {
            res.status(200).send(user)
            return;
        } else {
            res.status(200).send(false)
            return;
        }
    }
))

router.post("/getUser", asynceHandler(
    async (req, res) => {
        const _id = req.body;
        const user = await userModel.findOne({ _id });
        if (user) {
            res.status(200).send(user)
        } else {
            res.status(200).send(false)
        }
    }
))

router.post('/update', asynceHandler(
    async (req, res) => {
        const { _id, name, password, address } = req.body;

        try {
            const updateResult = await userModel.updateOne(
                { _id }, // Filter by ID
                { $set: { name, password, address } } // Update multiple fields (optional)
            );

            // Check for successful update (modifiedCount should be 1)
            if (updateResult.modifiedCount === 1) {
                res.send(true); // Send success message
            } else {
                res.status(HTTP_BAD_REQUEST).send(false); // Send failure message
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' }); // Send error message
        }
    }
));

router.post("/inviteFarmers", asynceHandler(
    async (req, res) => {
        console.log(req.body)
        const emails=req.body
            const mailOptions = {
                from: 'milkharbor78@gmail.com',
                to: emails.join(', '),
                subject: 'Invitation to Join MilkHarbor',
                text:
                    'Dear User, \n' +
                    'Greetings from the MilkHarbor family! We are thrilled to extend a warm invitation for you to join our growing community at MilkHarbor.\n'+ 
                    ' Your presence would add immense value to our team, and we believe your skills and expertise would contribute significantly to our shared goals.\n' +
                    'To get started, kindly register using the following link: \n' +
                    'http://localhost:4200/farmer-signup \n' +
                    'We look forward to welcoming you to the MilkHarbor community!\n' +
                    'Best regards, \n' +
                    'MilkHarbor Team'
            };
    
            transporter.sendMail(mailOptions, (error:any, info:any) => {
                if (error) {
                    console.error('Error:', error);
                    res.send(false);
                } else {
                    if (info.rejected.length > 0) {
                        res.send(false);
                    } else {
                        res.send(true);
                    }
                }
            });
    }
))

router.post('/checkUsername', asynceHandler(
    async (req, res) => {
        const { username } = req.body
        const user = await userModel.findOne({ username });
        if (user) {
            res.status(200).send(false)
        } else {
            res.send(true)
        }
    }
))

router.get('/getPendingFarmers', asynceHandler(
    async (req, res) => {
        const users = await userModel.find({ status: 'PENDING' });
        if (users) {
            res.status(200).send(users)
        } else {
            res.send(false)
        }
    }
))

router.get('/getFarmers', asynceHandler(
    async (req, res) => {
        const users = await userModel.find({ status: 'APPROVED' });
        if (users) {
            res.status(200).send(users)
        } else {
            res.send(false)
        }
    }
))

interface KeyValueMap {
    [key: string]: string;
}
router.post('/approve', asynceHandler(
    async (req, res) => {
        const keyValueMap: KeyValueMap = req.body;
        const ids: string[] = []
        for (const id of Object.keys(keyValueMap)) {
            console.log(id)
            ids.push(id)
        }
        try {
            const updateResult = await userModel.updateMany(
                { _id: { $in: ids } }, // Filter by ID
                { $set: { is_active: true, status: "APPROVED" } } // Update multiple fields (optional)
            );

            // Check for successful update (modifiedCount should be 1)
            if (updateResult.modifiedCount === ids.length) {
                res.send(true); // Send success message
            } else {
                res.status(HTTP_BAD_REQUEST).send(false); // Send failure message
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' }); // Send error message
        }
    }
))

router.post('/decline', asynceHandler(
    async (req, res) => {
        const keyValueMap: KeyValueMap = req.body;
        const ids: string[] = []
        for (const id of Object.keys(keyValueMap)) {
            console.log(id)
            ids.push(id)
        }
        try {
            const deleteResult = await userModel.deleteMany(
                { _id: { $in: ids } }, // Filter by ID
                { $set: { is_active: true, status: "APPROVED" } } // Update multiple fields (optional)
            );

            // Check for successful update (modifiedCount should be 1)
            if (deleteResult.deletedCount === ids.length) {
                res.send(true); // Send success message
            } else {
                res.status(HTTP_BAD_REQUEST).send(false); // Send failure message
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' }); // Send error message
        }
    }
))

router.put('/inactive', asynceHandler(
    async (req, res) => {
        const keyValueMap: KeyValueMap = req.body;
        const ids: string[] = []
        for (const id of Object.keys(keyValueMap)) {
            console.log(id)
            ids.push(id)
        }
        try {
            const updateResult = await userModel.updateMany(
                { _id: { $in: ids } }, // Filter by ID
                { $set: { is_active: false } } // Update multiple fields (optional)
            );

            // Check for successful update (modifiedCount should be 1)
            if (updateResult.modifiedCount === ids.length) {
                res.send(true); // Send success message
            } else {
                res.status(HTTP_BAD_REQUEST).send(false); // Send failure message
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' }); // Send error message
        }
    }
))

router.put('/active', asynceHandler(
    async (req, res) => {
        const keyValueMap: KeyValueMap = req.body;
        const ids: string[] = []
        for (const id of Object.keys(keyValueMap)) {
            console.log(id)
            ids.push(id)
        }
        try {
            const updateResult = await userModel.updateMany(
                { _id: { $in: ids } }, // Filter by ID
                { $set: { is_active: true } } // Update multiple fields (optional)
            );

            // Check for successful update (modifiedCount should be 1)
            if (updateResult.modifiedCount === ids.length) {
                res.send(true); // Send success message
            } else {
                res.status(HTTP_BAD_REQUEST).send(false); // Send failure message
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' }); // Send error message
        }
    }
))

// milk collection ---------------------

export default router;