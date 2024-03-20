import { Router } from 'express'
import asynceHandler from 'express-async-handler'
import { User, userModel } from '../models/user.model'
import { HTTP_BAD_REQUEST,accountSid, authToken, from_number } from '../constants/http'
const client = require('twilio')(accountSid, authToken);
const router = Router()
const data = {
    name: "vishal",
    address: "pune",
    m_no: "2ue9u29eu298",
    password: "sdjkndj",
    role: "admin",
    status: "sjhgsd",
    is_active: false
}

router.post("/register", asynceHandler(
    async (req, res) => {
        const { name, address, m_no, password, role, status, is_active } = req.body;
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
            password,
            role,
            status,
            is_active
        }
        await userModel.create(newUser)
        res.send(true).status(200);
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

router.post("/inviteFarmers", asynceHandler(
    async (req, res) => {
        const invites: String[] = req.body
        console.log(req.body)
        invites.forEach((ele:any)=>{
            client.messages.create({
                body: 'Done',
                from: from_number,
                to: '+91'+ele
            })
            .then((message:any)=>{
              console.log(message.sid)
            })

        })
        res.send(true)
    }
))

router.get("/getAll", asynceHandler(
    async (req, res) => {
        const users = await userModel.find();
        res.send(users)
    }
))



export default router;