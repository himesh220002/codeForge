// server/src/controllers/adminController.ts
import { Request, Response } from "express";
import { UserModel } from "../models/user.js";

// GET users with pagination
export async function getUsersController(req: Request, res: Response) {
  try {
    const page = parseInt((req.query.page as string) || "1", 10);
    const limit = parseInt((req.query.limit as string) || "20", 10);

    const total = await UserModel.countDocuments();
    const users = await UserModel.find({}, "name email role createdAt")
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

// PATCH update user role
export async function updateUserRoleController(req: Request, res: Response) {
  const { role } = req.body;

  if (!["user", "admin", "superuser", "owner"].includes(role)) {
    return res.status(400).json({ success: false, message: "Invalid role" });
  }


  try {
    // const targetUser = await UserModel.findByIdAndUpdate(
    //   req.params.id,
    //   { role },
    //   { returnDocument: "after" }
    // );
    const targetUser = await UserModel.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }


    const currentUser = (req as any).user;

    // Prevent self-role changes
    if (currentUser?.userId === req.params.id) {
      return res.status(400).json({ success: false, message: "You cannot change your own role" });
    }

    // Owner rules
    if (currentUser?.role === "owner") {
      // Owner can demote superuser → admin
      if (targetUser.role === "superuser" && role !== "admin") {
        return res.status(403).json({ success: false, message: "Owner can only demote SuperUser → Admin" });
      }

      // Owner can demote admin → user
      if (targetUser.role === "admin" && role === "user") {
        // allowed
      }

      // Owner can promote user → admin
      if (targetUser.role === "user" && role === "admin") {
        // allowed
      }

      // Owner can promote admin → superuser
      if (targetUser.role === "admin" && role === "superuser") {
        // allowed
      }

      // Block anything else
      if (
        (targetUser.role === "user" && role !== "admin") ||
        (targetUser.role === "admin" && !["user", "superuser"].includes(role)) ||
        (targetUser.role === "superuser" && role !== "admin")
      ) {
        return res.status(403).json({ success: false, message: "Invalid Owner action for this role change" });
      }
    }

    // SuperUser rules
    if (currentUser?.role === "superuser") {
      if (targetUser.role === "user" && role !== "admin") {
        return res.status(403).json({ success: false, message: "SuperUser can only promote user → admin" });
      }
      if (targetUser.role === "admin" && role !== "user") {
        return res.status(403).json({ success: false, message: "SuperUser can only demote admin → user" });
      }
      if (["superuser", "owner"].includes(targetUser.role)) {
        return res.status(403).json({ success: false, message: "SuperUser cannot change Owner/SuperUser roles" });
      }
    }

    // Admin rules
    if (currentUser?.role === "admin") {
      if (targetUser.role === "user" && role !== "admin") {
        return res.status(403).json({ success: false, message: "Admin can only promote user → admin" });
      }
      if (["admin", "superuser", "owner"].includes(targetUser.role)) {
        return res.status(403).json({ success: false, message: "Admin cannot change Admin/SuperUser/Owner roles" });
      }
    }

    targetUser.role = role;
    await targetUser.save();

    res.json({ success: true, message: "Role updated", data: targetUser });
  } catch {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function deleteUserController(req: Request, res: Response) {
  try {
    const targetUser = await UserModel.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ success: false, message: "User not found" });

    const currentUser = (req as any).user;

    // Prevent self-deletion
    if (currentUser?.userId === req.params.id) {
      return res.status(400).json({ success: false, message: "You cannot delete yourself" });
    }

    // Owner can delete users only
    if (currentUser?.role === "owner" && targetUser.role !== "user") {
      return res.status(403).json({ success: false, message: "Owner can only delete users" });
    }

    // SuperUser can delete users only
    if (currentUser?.role === "superuser" && targetUser.role !== "user") {
      return res.status(403).json({ success: false, message: "SuperUser can only delete users" });
    }

    // Admin can delete users only
    if (currentUser?.role === "admin" && targetUser.role !== "user") {
      return res.status(403).json({ success: false, message: "Admin can only delete users" });
    }

    await targetUser.deleteOne();
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

