// controllers/ownershipController.ts
import { Request, Response } from "express";
import { UserModel } from "../models/user.js";

export async function transferOwnershipController(req: Request, res: Response) {
  const { targetUserId } = req.body;

  try {
    // Current owner making the request
    const currentOwnerId = (req as any).user?.userId;

    if (!currentOwnerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Find target user
    const targetUser = await UserModel.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: "Target user not found" });
    }

    // Prevent transferring to a plain user
    if (targetUser.role === "user") {
      return res.status(400).json({ success: false, message: "Ownership can only be transferred to an admin or superuser" });
    }

    // Update target user to owner
    targetUser.role = "owner";
    await targetUser.save();

    // Optionally demote current owner to superuser
    await UserModel.findByIdAndUpdate(currentOwnerId, { role: "superuser" });

    console.log(`Ownership transferred from ${currentOwnerId} to ${targetUserId}`);

    return res.json({ success: true, message: "Ownership transferred successfully", data: targetUser });
  } catch (err) {
    console.error("Error transferring ownership:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
