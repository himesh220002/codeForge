// routes/adminRoutes.ts
import express from "express";
import { ownerMiddleware, superUserMiddleware, adminMiddleware } from "../middleware/adminMiddleware.js";
import { getUsersController, updateUserRoleController } from "../controllers/adminController.js";
import { deleteUserController } from "../controllers/adminController.js";

const router = express.Router();

// ✅ Allow owner, superuser, and admin to list users
router.get("/users", adminMiddleware, getUsersController);

// ✅ Only owner or superuser can change roles
router.patch("/users/:id", superUserMiddleware, updateUserRoleController);

// Example: ownership transfer route
// router.post("/transfer-ownership", ownerMiddleware, transferOwnershipController);

router.delete("/users/:id", adminMiddleware, deleteUserController);

export default router;
