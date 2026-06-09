import { Request, Response} from "express";
import { ContactModel } from "../models/contact.js"
import { success } from "zod";

// POST /api/contact
export async function createContactController(req: Request, res: Response) {
    try {
        const {name,email,message} = req.body;

        if(!name || !email || !message){
            return res.status(400).json({sucess: false, message: "All fields are required"});
        }

        const newContact = new ContactModel({
            name,email,message,createdAt: new Date()
        });
        
        await newContact.save();

        const data = res.json({data: newContact});
        console.log("contact form submition log:",data);

        return res.status(201).json({
            success: true,
            message:" Contact form submitted successfully",
            data: newContact
        });

    }catch(err){
        console.error("Error saving contact:", err);
        return res.status(500).json({success:false, message:"Internal Server Error"});
    }
}

// GET /api/contact (optional: list submissions)
export async function getContactsController(req:Request, res: Response){
    try{
        const contacts= await ContactModel.find().sort({createdAt: -1});
        return res.json({success: true, data: contacts});
    }catch(err){
        console.error("Error fetching contacts:", err);
        return res.status(500).json({sucess: false, message: "Internal Server Error"})
    }
}