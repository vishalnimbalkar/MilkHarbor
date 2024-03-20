import { Router } from 'express'
import asynceHandler from 'express-async-handler'
import { User, userModel } from '../models/user.model'
import { ObjectId } from 'mongodb';

import { HTTP_BAD_REQUEST, accountSid, authToken, from_number } from '../constants/http'
const router = Router()
const data = {
    name: "vishal",
    address: "pune",
    m_no: "2ue9u29eu298",
    username:"vishal",
    password: "sdjkndj",
    role: "admin",
    status: "sjhgsd",
    is_active: false
}

router.post("/register", asynceHandler(
    async (req, res) => {
        const { name, address, m_no,username, password, role, status, is_active } = req.body;
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
        // const invites: String[] = req.body
        // console.log(req.body)
        // invites.forEach((ele:any)=>{
        //     client.messages.create({
        //         body: 'Done',
        //         from: from_number,
        //         to: '+91'+ele
        //     })
        //     .then((message:any)=>{
        //       console.log(message.sid)
        //     })
        // })
        res.send(true)
    }
))

router.get('/checkUsername/:username', asynceHandler(
    async (req, res)=>{
        const {username}=req.body
        console.log(req.body)
        const user = await userModel.findOne({ username });
        console.log(user)
        if(user){
            res.status(200).send(true)
        }else{
            res.status(400).send(false)
        }
    }
))
router.get("/getAll", asynceHandler(
    async (req, res) => {
        const users = await userModel.find();
        res.send(users)
    }
))

export default router;