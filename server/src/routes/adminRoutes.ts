// routes/adminRoutes.ts
import express from "express";
import { ownerMiddleware, superUserMiddleware, adminMiddleware } from "../middleware/adminMiddleware.js";
import { getUsersController, updateUserRoleController, getSystemHealthController, getAtsAnalyticsController } from "../controllers/adminController.js";
import { deleteUserController } from "../controllers/adminController.js";
import { getContactsController } from "../controllers/contactController.js";
import { addTalentController, getTalentController, deleteTalentController } from "../controllers/talentController.js";

const router = express.Router();

// ✅ Allow owner, superuser, and admin to list users
router.get("/users", adminMiddleware, getUsersController);

// ✅ Allow admin to check system health
router.get("/system/health", adminMiddleware, getSystemHealthController);

// ✅ Allow admin to view ATS analytics
router.get("/analytics/ats", adminMiddleware, getAtsAnalyticsController);

// ✅ Talent Hub Routes
router.post("/talent", adminMiddleware, addTalentController);
router.get("/talent", adminMiddleware, getTalentController);
router.delete("/talent/:id", adminMiddleware, deleteTalentController);

// ✅ Only owner or superuser can change roles
router.patch("/users/:id", superUserMiddleware, updateUserRoleController);

// Example: ownership transfer route
// router.post("/transfer-ownership", ownerMiddleware, transferOwnershipController);

router.delete("/users/:id", adminMiddleware, deleteUserController);

// ✅ Allow owner, superuser, and admin to view contact messages
router.get("/contacts", adminMiddleware, getContactsController);

export default router;
