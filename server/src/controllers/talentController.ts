import { Request, Response } from 'express';
import { TalentModel } from '../models/talent.js';

export async function addTalentController(req: Request, res: Response) {
  try {
    const { name, email, phone, links, profession, score } = req.body;
    
    if (!name || !profession || score === undefined) {
      return res.status(400).json({ success: false, message: "Missing required talent fields" });
    }

    const newTalent = await TalentModel.create({
      name,
      email: email || "Not Found",
      phone: phone || "Not Found",
      links: links || [],
      profession,
      score
    });

    res.json({ success: true, message: "Talent added successfully", data: newTalent });
  } catch (error) {
    console.error("Error adding talent:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function getTalentController(req: Request, res: Response) {
  try {
    const talentList = await TalentModel.find({}).sort({ addedAt: -1 });
    res.json({ success: true, data: talentList });
  } catch (error) {
    console.error("Error fetching talent:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function deleteTalentController(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await TalentModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Talent not found" });
    }
    res.json({ success: true, message: "Talent deleted successfully" });
  } catch (error) {
    console.error("Error deleting talent:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
