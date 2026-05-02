import express from "express";

import controller from "../controller";

const router = express.Router();

router.get("/", controller.getLanding);

router.post("/login", controller.login);

router.post("/register", controller.register);

export default router;
