import { Router } from "express";

import { login, me, register } from "../../controllers/auth";
import authenticate from "../../middleware/authenticate";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, me);

export default router;
