import { Router } from 'express'
import asynceHandler from 'express-async-handler'
import { User, userModel } from '../models/user.model'
import { HTTP_BAD_REQUEST, API_KEY } from '../constants/http'

const router = Router()
const data = {
    name: "vishal",
    address: "pune",
    m_no: "2ue9u29eu298",
    username: "vishal",
    password: "sdjkndj",
    role: "admin",
    status: "sjhgsd",
    is_active: false
}

router.post("/register", asynceHandler(
    async (req, res) => {
    try {
        const { name, address, m_no, username, password, role, status, is_active } = req.body;
        const user = await userModel.findOne({ m_no });
        if (user) {
            res.status(HTTP_BAD_REQUEST).send("User already exist")
            return;
        }
        const newUser: User = {
            id: '',
            name,
            address,
            m_no,
            username,
            password,
            role,
            status,
            is_active
        }
        await userModel.create(newUser)
        // Send success response
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error:", error);
        // Send error response
        res.status(500).json({ error: "Internal server error" });
    }
    }
))

router.post("/login", asynceHandler(
    async (req, res) => {
        const { m_no, password } = req.body;
        const user = await userModel.findOne({ m_no, password });
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
        res.send(true)
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
        const users = await userModel.find({ status: 'APPROVED', role: "FARMER"});
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
        const ids:string[]=[]
        for (const id of Object.keys(keyValueMap)) {
                console.log(id)
               ids.push(id)
        }
        try {
            const updateResult = await userModel.updateMany(
                { _id: { $in: ids } }, // Filter by ID
                { $set: { is_active: true, status:"APPROVED" } } // Update multiple fields (optional)
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
        const ids:string[]=[]
        for (const id of Object.keys(keyValueMap)) {
                console.log(id)
               ids.push(id)
        }
        try {
            const deleteResult = await userModel.deleteMany(
                { _id: { $in: ids } }, // Filter by ID
                { $set: { is_active: true, status:"APPROVED" } } // Update multiple fields (optional)
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
            const ids:string[]=[]
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
        const ids:string[]=[]
        for (const id of Object.keys(keyValueMap)) {
                console.log(id)
               ids.push(id)
        }
        try {
            const updateResult = await userModel.updateMany(
                { _id: { $in: ids } }, // Filter by ID
                { $set: { is_active: true} } // Update multiple fields (optional)
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