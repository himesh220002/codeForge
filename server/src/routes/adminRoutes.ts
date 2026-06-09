// routes/adminRoutes.ts
import express from "express";
import { ownerMiddleware, superUserMiddleware, adminMiddleware } from "../middleware/adminMiddleware.js";
import { getUsersController, updateUserRoleController } from "../controllers/adminController.js";
import { deleteUserController } from "../controllers/adminController.js";
import { getContactsController } from "../controllers/contactController.js";

const router = express.Router();

// ✅ Allow owner, superuser, and admin to list users
router.get("/users", adminMiddleware, getUsersController);

// ✅ Only owner or superuser can change roles
router.patch("/users/:id", superUserMiddleware, updateUserRoleController);

// Example: ownership transfer route
// router.post("/transfer-ownership", ownerMiddleware, transferOwnershipController);

router.delete("/users/:id", adminMiddleware, deleteUserController);

// ✅ Allow owner, superuser, and admin to view contact messages
router.get("/contacts", adminMiddleware, getContactsController);

export default router;
