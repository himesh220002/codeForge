import { Request, Response } from "express";
import { UserModel } from "../models/user.js";
import { encrypt, decrypt } from "../utils/crypto.js";

export async function getUserSettingsController(req: Request, res: Response) {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let nvidiaApiKey = "";
        if (user.nvidiaApiHash) {
            try {
                nvidiaApiKey = decrypt(user.nvidiaApiHash);
            } catch (err) {
                console.error("Failed to decrypt user API key:", err);
                // If it fails to decrypt, we just return empty so they can reset it
            }
        }

        return res.status(200).json({
            nvidiaApiKey
        });
    } catch (err) {
        console.error("Error fetching user settings:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function updateUserSettingsController(req: Request, res: Response) {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { nvidiaApiKey } = req.body;

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (nvidiaApiKey) {
            user.nvidiaApiHash = encrypt(nvidiaApiKey.trim());
        } else if (nvidiaApiKey === "") {
            // Allow clearing the API key
            user.nvidiaApiHash = undefined;
        }

        await user.save();

        return res.status(200).json({ message: "Settings updated successfully" });
    } catch (err) {
        console.error("Error updating user settings:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}
