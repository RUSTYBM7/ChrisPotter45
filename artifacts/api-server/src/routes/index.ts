import { Router, type IRouter } from "express";
import healthRouter from "./health";
import newsletterRouter from "./newsletter";
import contactRouter from "./contactRoute";
import adminRouter from "./adminRoute";
import authRouter from "./authRoute";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/newsletter", newsletterRouter);
router.use("/contact", contactRouter);
router.use("/admin", adminRouter);
router.use("/auth", authRouter);

export default router;
