import express from 'express';
import getAuth from '../middleware/auth.js';
import Contact from '../models/ContactSchema.js';

const contactRouter = express.Router();
contactRouter.use(express.json());

contactRouter.get('/', getAuth, async (req, res) => {
    await Contact.find({
        user: req.userId
    }).populate('user')
    .then((result) => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
    })
})

contactRouter.post('/create', getAuth, async (req, res) => {
    try {
        const {name, phone, email} = req.body;
        if (name && phone && email) {
            const contact = new Contact({
                name, phone, email, user: req.userId
            })
            await contact.save();
            res.status(200).json({msg: "Contact Created", contact: contact});
        }
    }
    catch (err) {
        res.status(400).json({err: err});
    }
})

contactRouter.delete('/delete/:id', getAuth, async (req, res) => {
    try {
        const contact = await Contact.findOneAndDelete({
            user: req.userId,
            _id: req.params.id
        })
        if (!contact) {
            res.status(400).json({msg: "Contact not found"});
        }
        else {
            res.staus(200).json({msg: "Contact Deleted"});
        }
    }
    catch (err) {
        res.status(400).json({err: err});
    }
})

contactRouter.put('/update/:id', getAuth, async (req, res) => {
    try {
        const {name, phone, email} = req.body;
        const contact = await Contact.findByIdAndUpdate({
            user: req.userId,
            _id: req.params.id
        }, 
        {
            name, phone, email
        })
        if (!contact) {
            res.status(400).json({msg: "Contact not found"});
        }
        else {
            res.status(200).json({msg: "Contact Updated Successfully"});
        }
    }
    catch (err) {
        res.status(400).json({err: err});
    }
})

contactRouter.get("/:id", getAuth, async (req, res)=>{
    await Contact.findById(req.params.id).populate("user")
    .then((result) => {
        res.status(200).json({result: result})
    })
    .catch((err) => {
        res.status(400).json({err: err});
    })
})

export default contactRouter;